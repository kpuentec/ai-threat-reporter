from pydantic import BaseModel, Field
from datetime import datetime, timezone

class AnalyzeRequest(BaseModel):
    input_text: str = Field(..., description="Raw log snippet or URL to analyze")

class AnalyzeResponse(BaseModel):
    threat_type: str
    impact: str
    remediation: str
# MVP