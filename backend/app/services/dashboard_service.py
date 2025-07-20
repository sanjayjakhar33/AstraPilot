# backend/app/services/dashboard_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from app.models.user import User
from app.models.seodata import SeoData
from app.models.payment import Payment

# Get aggregate dashboard stats (expand as you add features)
async def get_dashboard_metrics(db: AsyncSession):
    users_count = await db.execute(func.count(User.id))
    paid_reports_count = await db.execute(func.count(SeoData.id))
    revenue = await db.execute(func.sum(Payment.amount))

    # Get scalar values from results
    users_count = users_count.scalar() or 0
    paid_reports_count = paid_reports_count.scalar() or 0
    revenue = revenue.scalar() or 0.0

    return {
        "active_users": users_count,
        "ai_reports_generated": paid_reports_count,
        "total_revenue": revenue,
        "avg_seo_score": 88  # Example, connect to real average if needed
    }
