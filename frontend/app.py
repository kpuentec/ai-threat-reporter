import streamlit as st
import requests
from datetime import datetime
from frontend.components.history_table import display_history

API_URL = "http://127.0.0.1:8000/analyze/"
HISTORY_API_URL = "http://127.0.0.1:8000/history/"
MAX_INPUT_LENGTH = 5000

st.set_page_config(page_title="AI Threat Reporter", page_icon="🛡️", layout="centered")

def load_css(file_path="frontend/styles.css"):
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
    placeholder="example. Multiple failed login attempts from 192.168.1.10",
    height=150,
)

if st.button("Analyze"):
    if not user_input.strip():
        st.warning("Please enter some text first.")
    elif len(user_input) > MAX_INPUT_LENGTH:
        st.error(f"Input too long! Max {MAX_INPUT_LENGTH} characters.")
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

                    st.markdown(f"**Threat Type:** <span style='color:{threat_color}'>{data['threat_type']}</span>", unsafe_allow_html=True)
                    st.write(f"**Impact:** {data['impact']}")
                    st.write(f"**Remediation:** {data['remediation']}")
                    st.caption(f"Timestamp: {data['timestamp']}")

                else:
                    st.error(f"Error {response.status_code}: {response.text}")

            except Exception as e:
                st.error(f"Request failed: {e}")

st.subheader("Past Analyses")
try:
    resp = requests.get(HISTORY_API_URL)
    if resp.status_code == 200:
        history_data = resp.json()
    else:
        history_data = []
except:
    history_data = []

display_history(history_data)
