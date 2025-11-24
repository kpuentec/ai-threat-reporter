from pymongo import MongoClient
from datetime import datetime, timezone
from app.config import MONGO_URI
import certifi

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["ai_threat_reporter"]
collection = db["analyses"]

def save_analysis(data: dict):
    """Save AI analysis result to MongoDB with UTC timestamp."""
    data["timestamp"] = datetime.now(timezone.utc)
    collection.insert_one(data)

def get_all_analyses(limit: int = 50):
    """Return last `limit` analyses sorted by newest first."""
    return list(collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
