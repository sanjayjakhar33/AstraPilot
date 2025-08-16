from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

class SEOAnalysisRequest(BaseModel):
    url: HttpUrl
    keywords: Optional[List[str]] = None
    analyze_competitors: Optional[bool] = False

class KeywordAnalysis(BaseModel):
    keyword: str
    density: float
    frequency: int
    placement_score: float
    recommended_frequency: int

class TechnicalSEO(BaseModel):
    page_speed_score: Optional[float] = None
    mobile_friendly: Optional[bool] = None
    has_sitemap: Optional[bool] = None
    has_robots_txt: Optional[bool] = None
    ssl_enabled: bool
    meta_tags_present: Dict[str, bool]
    heading_structure: Dict[str, int]
    images_with_alt: int
    images_without_alt: int
    internal_links: int
    external_links: int
    broken_links: List[str]

class ContentAnalysis(BaseModel):
    word_count: int
    readability_score: float
    reading_level: str
    sentence_count: int
    avg_sentence_length: float
    keyword_analysis: List[KeywordAnalysis]
    content_quality_score: float

class CompetitorData(BaseModel):
    domain: str
    title: str
    meta_description: str
    keywords: List[str]
    content_length: int
    backlinks_estimate: int
    domain_authority: Optional[int] = None

class SEORecommendation(BaseModel):
    category: str  # "technical", "content", "keywords", "links"
    priority: str  # "high", "medium", "low"
    issue: str
    recommendation: str
    impact: str
    effort: str  # "low", "medium", "high"

class SEOAnalysisResult(BaseModel):
    url: str
    overall_score: float
    technical_seo: TechnicalSEO
    content_analysis: ContentAnalysis
    recommendations: List[SEORecommendation]
    competitors: Optional[List[CompetitorData]] = None
    analysis_date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SEOReportRequest(BaseModel):
    user_id: int
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    url_filter: Optional[str] = None

class SEOMetrics(BaseModel):
    total_analyses: int
    avg_score: float
    score_trend: List[Dict[str, Any]]  # [{"date": "2024-01-01", "score": 85.5}]
    top_issues: List[Dict[str, Any]]
    improvement_areas: List[str]