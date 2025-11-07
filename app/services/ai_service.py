import os
import json
from google import genai
from app.config import GEMINI_API_KEY

_client = None
def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

def analyze_with_ai(input_text: str) -> dict:
    """
    Uses Gemini API (Python client) to analyze logs or URLs.
    Returns dict with 'threat_type', 'impact', 'remediation'.
    Falls back to local rules if API fails.
    """
    # debug
    # what is being sent to Gemini
    print("Sending to Gemini API")
    print(input_text)

    prompt = (
        f"Analyze the following log snippet or URL and return ONLY a strict JSON object "
        f"with keys: 'threat_type', 'impact', 'remediation'. "
        f"Do not include any explanations or extra text. Respond in valid JSON only.\n\n"
        f"Input:\n{input_text}"
    )

    try:
        client = _get_client()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text_output = response.text.strip()

        # debug
        # Gemini's raw response

        print("Gemini Response")
        print(text_output)

        if text_output.startswith("```"):
            # remove any code-fence markers
            text_output = text_output.strip("`").replace("json", "").strip()
        try:
            ai_result = json.loads(text_output)
        except json.JSONDecodeError:
            # If JSON parsing fails, log it and fallback
            print("Failed to parse Gemini JSON, falling back to local rules.")
            ai_result = {}

        return {
            "threat_type": ai_result.get("threat_type", "Unknown Threat"),
            "impact": ai_result.get("impact", "No clear threat pattern identified."),
            "remediation": ai_result.get("remediation", "Manual review is recommended.")
        }

    except Exception as e:
        # Log API failure and fallback
        print(f"Gemini API call failed: {e}, using fallback analysis.")
        return fallback_analysis(input_text)


def fallback_analysis(input_text: str) -> dict:
    """
    Simple local AI fallback for MVP if Gemini API fails.
    """
    text = input_text.lower()
    if "failed login" in text or "login failed" in text:
        return {
            "threat_type": "Brute Force Attack",
            "impact": "Multiple failed authentication attempts detected.",
            "remediation": "Block source IP and enforce multi-factor authentication."
        }
    elif "phishing" in text:
        return {
            "threat_type": "Phishing Attempt",
            "impact": "Potential email phishing link detected.",
            "remediation": "Do not click links and educate users on phishing awareness."
        }
    else:
        return {
            "threat_type": "Unknown Threat",
            "impact": "No clear threat pattern identified.",
            "remediation": "Manual review is recommended."
        }
