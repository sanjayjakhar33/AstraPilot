# backend/app/services/seo_service.py

from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.seodata import SeoData

# Example async function for saving SEO analysis result
async def perform_seo_analysis(db: AsyncSession, user_id: int, url: str) -> Dict:
    # Here, add real AI-powered SEO logic or connect to ML pipeline
    # For now, demo response:
    analysis_result = {
        "meta_tags_ok": False,
        "recommendations": [
            "Optimize meta description",
            "Add alt tags to images",
            "Improve H1 usage"
        ],
        "site_score": 82.5,
    }
    seodata = SeoData(
        user_id=user_id,
        url=url,
        analysis_result=analysis_result,
        score=analysis_result["site_score"]
    )
    db.add(seodata)
    await db.commit()
    await db.refresh(seodata)
    return analysis_result

# Get recent SEO analyses for a user/site
async def get_recent_seo_results(db: AsyncSession, user_id: int, limit: int = 10) -> List[SeoData]:
    results = await db.execute(
        SeoData.__table__.select()
        .where(SeoData.user_id == user_id)
        .order_by(SeoData.created_at.desc())
        .limit(limit)
    )
    return results.fetchall()
