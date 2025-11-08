#!/bin/bash
# start.sh

# Start backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Start frontend
streamlit run frontend/app.py --server.port 8501

# keep script running
wait
