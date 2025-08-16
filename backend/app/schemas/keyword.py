from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class KeywordRequest(BaseModel):
    keyword: str
    location: Optional[str] = "United States"
    language: Optional[str] = "en"

class KeywordDifficulty(BaseModel):
    keyword: str
    difficulty_score: float  # 0-100
    search_volume: int
    cpc: Optional[float] = None
    competition: str  # "low", "medium", "high"
    trend: List[int]  # Monthly trend data

class KeywordSuggestion(BaseModel):
    keyword: str
    search_volume: int
    difficulty: float
    relevance_score: float
    cpc: Optional[float] = None

class KeywordResearch(BaseModel):
    main_keyword: str
    search_volume: int
    difficulty_score: float
    cpc: Optional[float] = None
    competition_level: str
    seasonal_trends: List[Dict[str, Any]]
    related_keywords: List[KeywordSuggestion]
    long_tail_keywords: List[KeywordSuggestion]
    questions: List[str]
    suggested_content_topics: List[str]
    
    model_config = ConfigDict(from_attributes=True)

class CompetitorKeyword(BaseModel):
    keyword: str
    position: int
    search_volume: int
    traffic_estimate: int
    url: str

class CompetitorAnalysis(BaseModel):
    domain: str
    organic_keywords: int
    paid_keywords: int
    top_organic_keywords: List[CompetitorKeyword]
    keyword_gaps: List[KeywordSuggestion]  # Keywords competitors rank for but user doesn't
    content_gaps: List[str]
    
    model_config = ConfigDict(from_attributes=True)