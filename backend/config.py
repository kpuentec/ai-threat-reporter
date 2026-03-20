import os
from dotenv import load_dotenv
 
load_dotenv()
 
# New version hard crashes on startup if anything critical is missing. 
def _require(key: str) -> str:
    val = os.getenv(key)
    if not val:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return val
 
# Gemini
GEMINI_API_KEY = _require("GEMINI_API_KEY")
 
# Supabase
SUPABASE_URL = _require("SUPABASE_URL")
SUPABASE_ANON_KEY = _require("SUPABASE_ANON_KEY")
SUPABASE_DB_URL = _require("SUPABASE_DB_URL")   # postgres connection string
 
# Virustotal (FUTURE PLAN)
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY", "")
 
# App settings
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
DAILY_CREDIT_LIMIT = int(os.getenv("DAILY_CREDIT_LIMIT", "20"))
MAX_INPUT_LENGTH = int(os.getenv("MAX_INPUT_LENGTH", "5000"))
MAX_FILE_LINES = int(os.getenv("MAX_FILE_LINES", "200"))
