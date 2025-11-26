import streamlit as st
import requests
from datetime import datetime
from components.history_table import display_history
import os
# from frontend.components.history_table import display_history

API_URL = os.getenv("API_URL")
HISTORY_API_URL = os.getenv("HISTORY_API_URL")

if API_URL and not API_URL.endswith("/"):
    API_URL += "/"

if HISTORY_API_URL and not HISTORY_API_URL.endswith("/"):
    HISTORY_API_URL += "/"


MAX_INPUT_LENGTH = 5000


st.set_page_config(page_title="AI Threat Reporter", page_icon="🛡️", layout="centered")

def load_css(file_path="styles.css"):
    try:
        with open(file_path) as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
    except FileNotFoundError:
        pass

load_css()

st.title("AI-Powered Cyber Threat Reporter")
st.markdown("Analyze logs or URLs and get quick AI insights into potential threats.")

user_input = st.text_area(
    "Paste your log snippet or URL below:",
    placeholder="example. Multiple failed login attempts from 192.x.x.x",
    height=150,
)

if st.button("Analyze"):
    if not user_input.strip():
        st.warning("Please enter some text first.")
    elif len(user_input) > MAX_INPUT_LENGTH:
        st.error(f"Input too long! Max {MAX_INPUT_LENGTH} characters.")
    elif not API_URL:
        st.error("API_URL is not configured.")
    else:
        with st.spinner("Analyzing..."):
            try:
                response = requests.post(API_URL, json={"input_text": user_input})
                if response.status_code == 200:
                    data = response.json()
                    st.success("Analysis complete!")

                    st.subheader("Threat Summary")
                    threat_color = {
                        "Brute Force Attack": "red",
                        "Phishing Attempt": "orange",
                        "Unknown Threat": "gray"
                    }.get(data['threat_type'], "gray")

                    st.markdown(
                        f"**Threat Type:** <span style='color:{threat_color}'>{data['threat_type']}</span>",
                        unsafe_allow_html=True
                    )
                    st.write(f"**Impact:** {data['impact']}")
                    st.write(f"**Remediation:** {data['remediation']}")

                    if "timestamp" in data:
                        st.caption(f"Timestamp: {data['timestamp']}")

                else:
                    st.error(f"Error {response.status_code}: {response.text}")

            except Exception as e:
                st.error(f"Request failed: {e}")

st.subheader("Past Analyses")
if HISTORY_API_URL:
    try:
        resp = requests.get(HISTORY_API_URL)
        history_data = resp.json() if resp.status_code == 200 else []
    except:
        history_data = []
else:
    history_data = []

display_history(history_data)
