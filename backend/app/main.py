from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analyze
from datetime import datetime, timezone
import os
# from keepalive import keep_alive
app = FastAPI(title="AI Threat Reporter API", version="1.0")
#keep_alive()
# enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include API routes
app.include_router(analyze.router)

@app.get("/")
def root():
    return {
        "message": "Backend is running",
        "timestamp": datetime.now(timezone.utc)
    }
