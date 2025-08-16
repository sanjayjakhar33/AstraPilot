from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.schemas.subscription import SubscriptionPlan, SubscriptionRequest, LicenseStatus
from app.services.subscription_service import (
    get_subscription_plans, create_subscription, get_license_status,
    check_feature_access, validate_usage_limit
)

router = APIRouter(prefix="/license", tags=["License"])

@router.get("/plans", response_model=List[SubscriptionPlan])
async def list_subscription_plans():
    """Get all available subscription plans"""
    try:
        plans = await get_subscription_plans()
        return plans
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch plans: {str(e)}")

@router.post("/subscribe")
async def subscribe_to_plan(
    request: SubscriptionRequest,
    db: AsyncSession = Depends(get_db)
):
    """Subscribe user to a plan"""
    try:
        user_id = request.user_id or 1  # In real app, get from authentication
        license = await create_subscription(db, user_id, request.plan_id, request.billing_cycle)
        
        return {
            "success": True,
            "message": f"Successfully subscribed to {request.plan_id} plan",
            "license_id": license.id,
            "valid_until": license.valid_until
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subscription failed: {str(e)}")

@router.get("/status", response_model=LicenseStatus)
async def get_user_license_status(
    user_id: int = 1,  # In real app, get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive license status for a user"""
    try:
        license_status = await get_license_status(db, user_id)
        return license_status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch license status: {str(e)}")

@router.get("/check-feature/{feature}")
async def check_user_feature_access(
    feature: str,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Check if user has access to a specific feature"""
    try:
        has_access = await check_feature_access(db, user_id, feature)
        return {
            "feature": feature,
            "has_access": has_access,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature access check failed: {str(e)}")

@router.get("/check-usage/{resource_type}")
async def check_usage_limit(
    resource_type: str,
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Check usage limits for a specific resource"""
    try:
        from app.services.subscription_service import SubscriptionManager
        usage_info = await SubscriptionManager.check_usage_limit(db, user_id, resource_type)
        return usage_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Usage check failed: {str(e)}")

# Legacy endpoint for backwards compatibility
@router.get("/status-legacy")
async def license_status_legacy(user_id: int):
    """Legacy license status endpoint (deprecated)"""
    return {
        "user_id": user_id, 
        "active": True, 
        "plan": "pro",
        "message": "This endpoint is deprecated. Please use GET /license/status instead."
    }
