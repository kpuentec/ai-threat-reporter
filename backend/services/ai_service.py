import json
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

"""ai_service.py : Gemini w/ structured JSON output."""

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

# Response schema (enforced by Gemini)
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
You are a cybersecurity analyst. Analyze the following log snippet or URL.

Return a structured threat assessment with:
- threat_type: short label (e.g. "Brute Force", "SQL Injection", "Phishing", "Malware", "None")
- severity: one of Low | Medium | High | Critical | None
- impact: 1-2 sentence description of potential damage
- remediation: 2-3 actionable steps to mitigate

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