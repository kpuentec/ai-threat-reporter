from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
 
# requests
class AnalyzeRequest(BaseModel):
    input_text: str = Field(..., description="Raw log snippet or URL to analyze")
 
# responses
class AnalyzeResponse(BaseModel):
    id:           str
    threat_type:  str
    severity:     str   # Low | Medium | High | Critical | None
    impact:       str
    remediation:  str
    vt_result:    Optional[dict] = None
    created_at:   Optional[datetime] = None
 
class HistoryItem(BaseModel):
    id:           str
    input_text:   str
    input_type:   str
    threat_type:  str
    severity:     str
    impact:       str
    remediation:  str
    vt_result:    Optional[dict] = None
    created_at:   datetime
 
class StatsResponse(BaseModel):
    total_analyses:     int
    daily_used:         int
    daily_limit:        int
    daily_remaining:    int