from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, func
from app.database import Base

class Social(Base):
    __tablename__ = "social"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String(64), nullable=False)           # e.g. "facebook", "twitter"
    profile_url = Column(String(256), nullable=True)
    social_data = Column(JSON)                              # Store fetched API data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
