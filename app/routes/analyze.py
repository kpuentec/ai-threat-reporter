from fastapi import APIRouter, HTTPException
from app.models.threat_model import AnalyzeRequest, AnalyzeResponse
from app.services.ai_service import analyze_with_ai
from app.services.db_service import save_analysis

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("/", response_model=AnalyzeResponse)
def analyze_threat(request: AnalyzeRequest):
    try:
        ai_result = analyze_with_ai(request.input_text)
        result = {
            "threat_type": ai_result["threat_type"],
            "impact": ai_result["impact"],
            "remediation": ai_result["remediation"]
        }

        save_analysis({**result, "input_text": request.input_text})
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
