from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider = Column(String(32), nullable=False)  # e.g., 'stripe', 'paypal'
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="USD")
    status = Column(String(32), default="pending") # pending, paid, failed, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Relationships
    user = relationship("User", back_populates="payments")
