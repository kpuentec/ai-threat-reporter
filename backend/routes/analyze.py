import json
import anyio
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from models.threat_model import AnalyzeRequest, AnalyzeResponse, HistoryItem, StatsResponse
from services.ai_service import analyze_with_ai
from services.auth_service import verify_token
from services.db_service import (
    save_analysis,
    get_analyses_by_user,
    get_total_analyses_count,
    save_log_file_record,
    check_credit_limit,
    increment_usage,
)
from services.log_parser import parse_log_file, chunk_lines, LogParseError
from services.virustotal_service import scan_url
from config import MAX_INPUT_LENGTH

"""routes/analyze.py : All threat analysis endpoints, all routes require a valid Supabase JWT."""
 
router = APIRouter(prefix="/api", tags=["Threat Analysis"])
 
# helper funcs
async def _enforce_credits(user_id: str):
    allowed, remaining = await check_credit_limit(user_id)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Daily analysis limit reached. Try again tomorrow.",
        )
    return remaining
 
async def _run_analysis(input_text: str, input_type: str, user_id: str) -> dict:
    """Core logic: AI analyze, Virustotal scan(FUTURE), save, return."""
    ai_result = await anyio.to_thread.run_sync(analyze_with_ai, input_text)
    vt_result = await anyio.to_thread.run_sync(scan_url, input_text)
 
    data = {
        "user_id":    user_id,
        "input_text": input_text,
        "input_type": input_type,
        **ai_result,
        "vt_result":  json.dumps(vt_result) if vt_result else None,
    }
    row_id = await save_analysis(data)
    await increment_usage(user_id)
 
    return {
        "id":          row_id,
        "threat_type": ai_result["threat_type"],
        "severity":    ai_result["severity"],
        "impact":      ai_result["impact"],
        "remediation": ai_result["remediation"],
        "vt_result":   vt_result,
    }
 
# POST /api/analyze 
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(
    body: AnalyzeRequest,
    user_id: str = Depends(verify_token),
):
    if len(body.input_text) > MAX_INPUT_LENGTH:
        raise HTTPException(status_code=413, detail=f"Input too long. Max {MAX_INPUT_LENGTH} chars.")
 
    await _enforce_credits(user_id)
 
    try:
        result = await _run_analysis(body.input_text, "text", user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
# POST /api/analyze/file
@router.post("/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_token),
):
    if not file.filename.endswith((".txt", ".log")):
        raise HTTPException(status_code=400, detail="Only .txt and .log files are supported.")
 
    content = await file.read()
 
    try:
        lines = parse_log_file(content, file.filename)
    except LogParseError as e:
        raise HTTPException(status_code=400, detail=str(e))
 
    await _enforce_credits(user_id)
    await save_log_file_record(user_id, file.filename, len(lines))
 
    chunks = chunk_lines(lines, chunk_size=10)
    results = []
 
    for chunk in chunks:
        try:
            result = await _run_analysis(chunk, "file", user_id)
            results.append(result)
        except Exception as e:
            results.append({"error": str(e), "input": chunk[:100]})
 
    return {
        "filename":       file.filename,
        "lines_processed": len(lines),
        "chunks_analyzed": len(chunks),
        "results":         results,
    }
 
# GET /api/history 
@router.get("/history", response_model=list[HistoryItem])
async def get_history(
    limit: int = 50,
    user_id: str = Depends(verify_token),
):
    return await get_analyses_by_user(user_id, limit=limit)
 
# GET /api/stats
@router.get("/stats", response_model=StatsResponse)
async def get_stats(user_id: str = Depends(verify_token)):
    from config import DAILY_CREDIT_LIMIT
    allowed, remaining = await check_credit_limit(user_id)
    total = await get_total_analyses_count()
    used = DAILY_CREDIT_LIMIT - remaining
 
    return {
        "total_analyses":  total,
        "daily_used":      used,
        "daily_limit":     DAILY_CREDIT_LIMIT,
        "daily_remaining": remaining,
    }