from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.keyword import (
    KeywordRequest, KeywordResearch, KeywordDifficulty, 
    CompetitorAnalysis
)
from app.services.keyword_service import (
    research_keywords, analyze_competitor_keywords, batch_analyze_keywords
)

router = APIRouter(prefix="/keywords", tags=["Keywords"])

@router.post("/research", response_model=KeywordResearch)
async def keyword_research(request: KeywordRequest):
    """
    Perform comprehensive keyword research including:
    - Search volume analysis
    - Keyword difficulty scoring  
    - Related keywords discovery
    - Long-tail keyword suggestions
    - Content topic suggestions
    """
    try:
        research_result = await research_keywords(request)
        return research_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword research failed: {str(e)}")

@router.post("/difficulty", response_model=List[KeywordDifficulty])
async def analyze_keyword_difficulty(keywords: List[str]):
    """
    Analyze keyword difficulty and competition for multiple keywords
    """
    try:
        if len(keywords) > 50:
            raise HTTPException(status_code=400, detail="Maximum 50 keywords allowed per request")
        
        difficulty_analysis = await batch_analyze_keywords(keywords)
        return difficulty_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Difficulty analysis failed: {str(e)}")

@router.get("/competitor-analysis/{domain}", response_model=CompetitorAnalysis)
async def competitor_keyword_analysis(domain: str, user_keywords: List[str] = None):
    """
    Analyze competitor's keyword strategy and find keyword gaps
    """
    try:
        # Basic domain validation
        if not domain or '.' not in domain:
            raise HTTPException(status_code=400, detail="Invalid domain format")
        
        competitor_analysis = await analyze_competitor_keywords(domain, user_keywords)
        return competitor_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Competitor analysis failed: {str(e)}")

@router.get("/suggestions/{seed_keyword}")
async def get_keyword_suggestions(seed_keyword: str, limit: int = 20):
    """
    Get keyword suggestions based on a seed keyword
    """
    try:
        request = KeywordRequest(keyword=seed_keyword)
        research_result = await research_keywords(request)
        
        # Combine related and long-tail keywords
        all_suggestions = research_result.related_keywords + research_result.long_tail_keywords
        
        # Sort by relevance score and limit results
        sorted_suggestions = sorted(all_suggestions, key=lambda x: x.relevance_score, reverse=True)
        
        return {
            "seed_keyword": seed_keyword,
            "suggestions": sorted_suggestions[:limit],
            "questions": research_result.questions[:10],
            "content_topics": research_result.suggested_content_topics[:5]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestion generation failed: {str(e)}")

@router.get("/trends/{keyword}")
async def get_keyword_trends(keyword: str):
    """
    Get keyword trend data and seasonal patterns
    """
    try:
        request = KeywordRequest(keyword=keyword)
        research_result = await research_keywords(request)
        
        return {
            "keyword": keyword,
            "search_volume": research_result.search_volume,
            "difficulty_score": research_result.difficulty_score,
            "seasonal_trends": research_result.seasonal_trends,
            "competition_level": research_result.competition_level
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")