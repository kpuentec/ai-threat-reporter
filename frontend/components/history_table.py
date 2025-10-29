import streamlit as st
import pandas as pd

def display_history(history_data):
    """Display previously analyzed logs."""
    if not history_data:
        st.info("No past analyses found.")
        return
    df = pd.DataFrame(history_data)
    st.dataframe(df)