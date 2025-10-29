import streamlit as st
import requests
from datetime import datetime

# config
# local FastAPI backend
API_URL = "http://127.0.0.1:8000/analyze/"
# Gemini URL = 
st.set_page_config(page_title="AI Threat Reporter", page_icon="🧠", layout="centered")

# header
st.title("AI-Powered Cyber Threat Reporter")
st.markdown("Analyze logs or URLs and get quick AI insights into potential cyber threats.")

# input
user_input = st.text_area(
    "Paste your log snippet or URL below:",
    placeholder="e.g. Multiple failed login attempts from 192.168.1.10",
    height=150,
)

if st.button("Analyze"):
    if not user_input.strip():
        st.warning("Please enter some text first.")
    else:
        with st.spinner("Analyzing..."):
            try:
                response = requests.post(API_URL, json={"input_text": user_input})
                if response.status_code == 200:
                    data = response.json()
                    st.success("Analysis complete!")
                    st.subheader("Threat Summary")
                    st.write(f"**Threat Type:** {data['threat_type']}")
                    st.write(f"**Impact:** {data['impact']}")
                    st.write(f"**Remediation:** {data['remediation']}")
                    st.caption(f"Timestamp: {data['timestamp']}")
                else:
                    st.error(f"Error {response.status_code}: {response.text}")
            except Exception as e:
                st.error(f"Request failed: {e}")
