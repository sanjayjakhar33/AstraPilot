from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, func
from app.database import Base

class SeoData(Base):
    __tablename__ = "seodata"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String(255), nullable=False)
    analysis_result = Column(JSON)    # Save AI/analytics output as JSON
    score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
