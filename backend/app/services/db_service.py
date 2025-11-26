from pymongo import MongoClient
from datetime import datetime, timezone
from config import MONGO_URI

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

try:
    client.admin.command("ping")
    print("Connected to MongoDB")
except Exception as e:
    print("MongoDB connection failed:", e)
    
db = client["ai_threat_reporter"]
collection = db["analyses"]

def save_analysis(data: dict):
    """Save AI analysis result to MongoDB with UTC timestamp."""
    data["timestamp"] = datetime.now(timezone.utc)
    collection.insert_one(data)

def get_all_analyses(limit: int = 50):
    """Return last `limit` analyses sorted by newest first."""
    return list(collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
