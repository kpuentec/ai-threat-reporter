from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timedelta
from app.models.threat_model import AnalyzeRequest, AnalyzeResponse
from app.services.ai_service import analyze_with_ai
from app.services.db_service import save_analysis, get_all_analyses
import anyio

router = APIRouter(tags=["Threat Analysis"])

request_log = {}
MAX_REQUESTS = 10
WINDOW_MINUTES = 10

def check_rate_limit(client_ip: str):
    now = datetime.utcnow()
    window_start = now - timedelta(minutes=WINDOW_MINUTES)
    timestamps = request_log.get(client_ip, [])
    timestamps = [t for t in timestamps if t > window_start]

    if len(timestamps) >= MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")

    timestamps.append(now)
    request_log[client_ip] = timestamps

@router.post("/analyze/", response_model=AnalyzeResponse)
async def analyze_threat(request: Request, body: AnalyzeRequest):
    client_ip = request.headers.get("x-forwarded-for", request.client.host)
    check_rate_limit(client_ip)

    if len(body.input_text) > 5000:
        raise HTTPException(status_code=413, detail="Input text too long. Max 5000 characters allowed.")

    try:
        ai_result = await anyio.to_thread.run_sync(analyze_with_ai, body.input_text)

        result = {
            "threat_type": ai_result["threat_type"],
            "impact": ai_result["impact"],
            "remediation": ai_result["remediation"]
        }

        await anyio.to_thread.run_sync(save_analysis, {**result, "input_text": body.input_text})
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/")
async def fetch_history():
    return await anyio.to_thread.run_sync(get_all_analyses)
