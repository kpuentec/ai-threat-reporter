import streamlit as st
import pandas as pd

def display_history(history_data):
    """Display previously analyzed logs in a table."""
    if not history_data:
        st.info("No past analyses found.")
        return

    df = pd.DataFrame(history_data)
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.strftime("%Y-%m-%d %H:%M:%S UTC")
    st.dataframe(df)
