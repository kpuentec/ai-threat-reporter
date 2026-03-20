import re
import requests
from config import VIRUSTOTAL_API_KEY

"""
virustotal_service.py : URL scanning via VirusTotal free API.
Gracefully returns None if API key is not configured.
"""

_VT_BASE = "https://www.virustotal.com/api/v3"
_URL_RE  = re.compile(r"https?://[^\s]+")

def _looks_like_url(text: str) -> bool:
    return bool(_URL_RE.search(text.strip()))

def scan_url(input_text: str) -> dict | None:
    """
    If input looks like a URL and VT key is configured, scan it.
    Returns a summary dict or None.
    """
    if not VIRUSTOTAL_API_KEY:
        return None
    if not _looks_like_url(input_text):
        return None

    url = _URL_RE.search(input_text).group(0)

    try:
        # Step 1: submit URL
        submit = requests.post(
            f"{_VT_BASE}/urls",
            headers={"x-apikey": VIRUSTOTAL_API_KEY},
            data={"url": url},
            timeout=10,
        )
        submit.raise_for_status()
        analysis_id = submit.json()["data"]["id"]

        # Step 2: fetch report
        report = requests.get(
            f"{_VT_BASE}/analyses/{analysis_id}",
            headers={"x-apikey": VIRUSTOTAL_API_KEY},
            timeout=10,
        )
        report.raise_for_status()
        stats = report.json()["data"]["attributes"]["stats"]

        return {
            "url":        url,
            "malicious":  stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless":   stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
        }
    except Exception as e:
        print(f"VirusTotal scan failed: {e}")
        return None