from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics")
async def get_dashboard_metrics():
    # Placeholder: connect to real dashboard data
    return {
        "live_users": 18,
        "ai_reports_generated": 2330,
        "avg_site_score": 87
    }
