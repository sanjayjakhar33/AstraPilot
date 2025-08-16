from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PaymentRequest(BaseModel):
    plan: str
    user_id: Optional[int] = None
    billing_cycle: Optional[str] = "monthly"

class PaymentResponse(BaseModel):
    status: str
    plan: str
    message: str
    payment_id: Optional[int] = None

class PaymentInDB(BaseModel):
    id: int
    user_id: int
    provider: str
    amount: float
    currency: str
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)