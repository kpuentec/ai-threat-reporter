def analyze_with_ai(input_text: str):
    """
    sim of AI analysis for mvp
    fix ltr
    """
    # xample
    if "failed login" in input_text.lower():
        threat_type = "Brute Force Attack"
        impact = "Multiple failed authentication attempts detected."
        remediation = "Block source IP and enforce multi-factor authentication."
    elif "phishing" in input_text.lower():
        threat_type = "Phishing Attempt"
        impact = "Potential email phishing link detected."
        remediation = "Do not click links and educate users on phishing awareness."
    else:
        threat_type = "Unknown Threat"
        impact = "No clear threat pattern identified."
        remediation = "Manual review is recommended."

    return {
        "threat_type": threat_type,
        "impact": impact,
        "remediation": remediation
    }
