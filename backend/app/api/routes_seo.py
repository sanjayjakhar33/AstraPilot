from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.seo import SEOAnalysisRequest, SEOAnalysisResult
from app.services.seo_service import perform_seo_analysis, get_recent_seo_results, get_seo_analytics
from typing import List

router = APIRouter(prefix="/seo", tags=["SEO"])

@router.post("/analyze", response_model=SEOAnalysisResult)
async def analyze_website(
    request: SEOAnalysisRequest,
    user_id: int = 1,  # In a real app, this would come from authentication
    db: AsyncSession = Depends(get_db)
):
    """Perform comprehensive SEO analysis of a website"""
    try:
        analysis_result = await perform_seo_analysis(db, user_id, request)
        return analysis_result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/history")
async def get_analysis_history(
    user_id: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get recent SEO analysis history for a user"""
    try:
        results = await get_recent_seo_results(db, user_id, limit)
        return {"analyses": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

@router.get("/analytics")
async def get_analytics(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Get SEO analytics and trends for a user"""
    try:
        analytics = await get_seo_analytics(db, user_id)
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {str(e)}")

# Legacy endpoint for backwards compatibility
@router.get("/analyze")
async def analyze_site_legacy(url: str):
    """Legacy analyze endpoint (deprecated)"""
    return {
        "url": url, 
        "score": 90, 
        "recommendations": ["Fix heading tags", "Add alt text"],
        "message": "This endpoint is deprecated. Please use POST /seo/analyze instead."
    }
