"""
ai_service.py — Gemini 2.0 Flash with structured JSON output.
No more fragile string parsing — we use response_schema.
"""
import json
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

_RESPONSE_SCHEMA = types.Schema(
    type=types.Type.OBJECT,
    properties={
        "threat_type": types.Schema(type=types.Type.STRING),
        "severity":    types.Schema(
                           type=types.Type.STRING,
                           enum=["Low", "Medium", "High", "Critical", "None"]
                       ),
        "impact":      types.Schema(type=types.Type.STRING),
        "remediation": types.Schema(type=types.Type.STRING),
    },
    required=["threat_type", "severity", "impact", "remediation"],
)

_PROMPT_TEMPLATE = """\
You are an expert cybersecurity analyst. Analyze the following log entries or URL for security threats.

Log entries may contain keywords like ERROR, WARN, CRITICAL, failed login, malware, SQL injection, XSS, ransomware, phishing, brute force, unauthorized access, port scan, data exfiltration, privilege escalation, or suspicious processes.

Return a structured threat assessment with:
- threat_type: short label describing the PRIMARY threat found (e.g. "Brute Force Attack", "SQL Injection", "Phishing", "Malware", "Ransomware", "XSS", "Data Exfiltration", "Privilege Escalation", "Port Scan", "None")
- severity: one of Low | Medium | High | Critical | None based on the threat level
- impact: 1-2 sentence description of the potential damage or risk
- remediation: 2-3 concrete actionable steps to mitigate the threat

If multiple threats are present, focus on the most severe one.
If no threat is found, return threat_type "None" and severity "None".

Input:
{input_text}
"""

def analyze_with_ai(input_text: str) -> dict:
    """
    Calls Gemini 2.0 Flash with a structured output schema.
    Falls back to local rules if the API fails.
    """
    try:
        client = _get_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=_PROMPT_TEMPLATE.format(input_text=input_text),
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=_RESPONSE_SCHEMA,
                temperature=0.2,   # low temp = consistent structured output
            ),
        )
        result = json.loads(response.text)

        return {
            "threat_type": result.get("threat_type", "Unknown"),
            "severity":    result.get("severity",    "Unknown"),
            "impact":      result.get("impact",      "No clear threat pattern identified."),
            "remediation": result.get("remediation", "Manual review is recommended."),
        }
    except Exception as e:
        print(f"Gemini API failed: {e}. Using fallback.")
        return _fallback_analysis(input_text)


def _fallback_analysis(input_text: str) -> dict:
    """Rule-based fallback if Gemini is unavailable."""
    text = input_text.lower()
    if "failed login" in text or "login failed" in text or "invalid password" in text:
        return {
            "threat_type": "Brute Force Attack",
            "severity":    "High",
            "impact":      "Multiple failed authentication attempts detected.",
            "remediation": "Block source IP, enforce MFA, and review auth logs.",
        }
    if "phishing" in text or "suspicious link" in text:
        return {
            "threat_type": "Phishing Attempt",
            "severity":    "Medium",
            "impact":      "Potential phishing link or social engineering attempt.",
            "remediation": "Do not click links. Report to security team and educate users.",
        }
    if "select " in text and ("where" in text or "union" in text):
        return {
            "threat_type": "SQL Injection",
            "severity":    "Critical",
            "impact":      "Possible SQL injection payload in input.",
            "remediation": "Sanitize all inputs, use parameterized queries, review DB logs.",
        }
    return {
        "threat_type": "Unknown Threat",
        "severity":    "Low",
        "impact":      "No clear threat pattern identified.",
        "remediation": "Manual review is recommended.",
    }