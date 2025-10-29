from pymongo import MongoClient
from datetime import datetime, timezone
from app.config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["ai_threat_reporter"]
collection = db["analyses"]

def save_analysis(data: dict):
    """Save AI analysis result to MongoDB."""
    data["timestamp"] = datetime.now(timezone.utc)
    collection.insert_one(data)
