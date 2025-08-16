from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class SubscriptionPlan(BaseModel):
    plan_id: str
    name: str
    description: str
    price_monthly: float
    price_yearly: float
    features: List[str]
    limits: Dict[str, int]  # e.g., {"websites": 5, "analyses_per_month": 100}
    is_popular: bool = False

class SubscriptionRequest(BaseModel):
    plan_id: str
    billing_cycle: str  # "monthly" or "yearly"
    user_id: Optional[int] = None

class LicenseStatus(BaseModel):
    user_id: int
    plan: str
    is_active: bool
    valid_until: Optional[datetime] = None
    usage_stats: Dict[str, Any]
    limits: Dict[str, int]
    features_available: List[str]
    
    model_config = ConfigDict(from_attributes=True)

class UsageTracker(BaseModel):
    user_id: int
    resource_type: str  # "seo_analysis", "keyword_research", "competitor_analysis"
    count: int
    period: str  # "monthly", "daily"
    reset_date: datetime
    
    model_config = ConfigDict(from_attributes=True)