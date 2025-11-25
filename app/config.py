import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not set")

if not MONGO_URI:
    print("WARNING: MONGO_URI not set")

'''
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set in .env")
MONGO_URI = os.getenv("MONGO_URI")
'''