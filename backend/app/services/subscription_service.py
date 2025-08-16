# Enhanced Subscription and License Management Service

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.license import License
from app.schemas.subscription import SubscriptionPlan, LicenseStatus, UsageTracker
import asyncio

class SubscriptionManager:
    """
    Manages subscription plans, license validation, and usage tracking
    """
    
    # Define subscription plans
    PLANS = {
        "free": SubscriptionPlan(
            plan_id="free",
            name="Free Plan",
            description="Perfect for trying out our SEO tools",
            price_monthly=0.0,
            price_yearly=0.0,
            features=[
                "Basic SEO analysis",
                "Keyword research (5 keywords/day)",
                "Basic reporting",
                "Email support"
            ],
            limits={
                "websites": 1,
                "seo_analyses_per_month": 10,
                "keyword_research_per_day": 5,
                "competitor_analyses_per_month": 0,
                "api_calls_per_day": 50
            }
        ),
        "basic": SubscriptionPlan(
            plan_id="basic",
            name="Basic Plan",
            description="Great for small businesses and freelancers",
            price_monthly=29.99,
            price_yearly=299.99,
            features=[
                "Advanced SEO analysis",
                "Unlimited keyword research",
                "Competitor analysis (5/month)",
                "Custom reporting",
                "Priority email support",
                "SEO recommendations"
            ],
            limits={
                "websites": 5,
                "seo_analyses_per_month": 100,
                "keyword_research_per_day": -1,  # unlimited
                "competitor_analyses_per_month": 5,
                "api_calls_per_day": 500
            }
        ),
        "pro": SubscriptionPlan(
            plan_id="pro",
            name="Pro Plan",
            description="Perfect for agencies and growing businesses",
            price_monthly=79.99,
            price_yearly=799.99,
            features=[
                "All Basic features",
                "White-label reporting",
                "Advanced competitor analysis",
                "Backlink tracking",
                "API access",
                "Custom integrations",
                "Phone support",
                "Team collaboration"
            ],
            limits={
                "websites": 25,
                "seo_analyses_per_month": 500,
                "keyword_research_per_day": -1,
                "competitor_analyses_per_month": 25,
                "api_calls_per_day": 2000
            },
            is_popular=True
        ),
        "enterprise": SubscriptionPlan(
            plan_id="enterprise",
            name="Enterprise Plan",
            description="For large organizations with custom needs",
            price_monthly=199.99,
            price_yearly=1999.99,
            features=[
                "All Pro features",
                "Unlimited everything",
                "Custom reporting dashboard",
                "Dedicated account manager",
                "SLA guarantee",
                "Custom integrations",
                "On-premise deployment option",
                "Advanced analytics"
            ],
            limits={
                "websites": -1,  # unlimited
                "seo_analyses_per_month": -1,
                "keyword_research_per_day": -1,
                "competitor_analyses_per_month": -1,
                "api_calls_per_day": -1
            }
        )
    }
    
    @classmethod
    def get_plan(cls, plan_id: str) -> Optional[SubscriptionPlan]:
        """Get subscription plan by ID"""
        return cls.PLANS.get(plan_id)
    
    @classmethod
    def get_all_plans(cls) -> List[SubscriptionPlan]:
        """Get all available subscription plans"""
        return list(cls.PLANS.values())
    
    @classmethod
    async def create_subscription(cls, db: AsyncSession, user_id: int, plan_id: str, billing_cycle: str = "monthly"):
        """Create a new subscription for a user"""
        plan = cls.get_plan(plan_id)
        if not plan:
            raise ValueError(f"Invalid plan ID: {plan_id}")
        
        # Calculate validity period
        if billing_cycle == "yearly":
            valid_days = 365
        else:
            valid_days = 30
            
        valid_until = datetime.utcnow() + timedelta(days=valid_days)
        
        # Deactivate existing licenses
        await cls.deactivate_user_licenses(db, user_id)
        
        # Create new license
        license = License(
            user_id=user_id,
            plan=plan_id,
            is_active=True,
            valid_until=valid_until
        )
        db.add(license)
        await db.commit()
        await db.refresh(license)
        
        return license
    
    @classmethod
    async def get_user_license_status(cls, db: AsyncSession, user_id: int) -> LicenseStatus:
        """Get comprehensive license status for a user"""
        # Get active license
        q = await db.execute(
            select(License).where(
                License.user_id == user_id, 
                License.is_active == True
            ).order_by(License.created_at.desc())
        )
        license = q.scalars().first()
        
        if not license:
            # Return free plan as default
            plan = cls.get_plan("free")
            return LicenseStatus(
                user_id=user_id,
                plan="free",
                is_active=True,
                valid_until=None,
                usage_stats=await cls._get_usage_stats(db, user_id),
                limits=plan.limits,
                features_available=plan.features
            )
        
        # Check if license is expired
        is_expired = license.valid_until and license.valid_until < datetime.utcnow()
        if is_expired:
            license.is_active = False
            await db.commit()
            
            # Return free plan for expired licenses
            plan = cls.get_plan("free")
            return LicenseStatus(
                user_id=user_id,
                plan="free",
                is_active=True,
                valid_until=None,
                usage_stats=await cls._get_usage_stats(db, user_id),
                limits=plan.limits,
                features_available=plan.features
            )
        
        plan = cls.get_plan(license.plan)
        if not plan:
            plan = cls.get_plan("free")
        
        return LicenseStatus(
            user_id=user_id,
            plan=license.plan,
            is_active=license.is_active,
            valid_until=license.valid_until,
            usage_stats=await cls._get_usage_stats(db, user_id),
            limits=plan.limits,
            features_available=plan.features
        )
    
    @classmethod
    async def check_usage_limit(cls, db: AsyncSession, user_id: int, resource_type: str) -> Dict[str, any]:
        """Check if user has exceeded usage limits for a resource"""
        license_status = await cls.get_user_license_status(db, user_id)
        
        # Get current usage
        usage_stats = license_status.usage_stats
        current_usage = usage_stats.get(resource_type, 0)
        
        # Get limit for this resource
        limit_key = f"{resource_type}_per_month"
        if resource_type in ["keyword_research"]:
            limit_key = f"{resource_type}_per_day"
        
        limit = license_status.limits.get(limit_key, 0)
        
        # -1 means unlimited
        if limit == -1:
            return {"allowed": True, "remaining": -1, "limit": -1}
        
        remaining = max(0, limit - current_usage)
        allowed = current_usage < limit
        
        return {
            "allowed": allowed,
            "remaining": remaining,
            "limit": limit,
            "current_usage": current_usage
        }
    
    @classmethod
    async def increment_usage(cls, db: AsyncSession, user_id: int, resource_type: str):
        """Increment usage counter for a resource"""
        # In a production system, you'd store usage in a separate table
        # For now, we'll simulate this
        pass
    
    @classmethod
    async def deactivate_user_licenses(cls, db: AsyncSession, user_id: int):
        """Deactivate all active licenses for a user"""
        q = await db.execute(
            select(License).where(
                License.user_id == user_id,
                License.is_active == True
            )
        )
        licenses = q.scalars().all()
        
        for license in licenses:
            license.is_active = False
        
        await db.commit()
    
    @classmethod
    async def _get_usage_stats(cls, db: AsyncSession, user_id: int) -> Dict[str, int]:
        """Get current usage statistics for a user"""
        # In a production system, you'd query a usage tracking table
        # For now, we'll return simulated data
        current_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Count SEO analyses for current month
        from app.models.seodata import SeoData
        seo_count_q = await db.execute(
            select(SeoData).where(
                SeoData.user_id == user_id,
                SeoData.created_at >= current_month
            )
        )
        seo_analyses = len(seo_count_q.scalars().all())
        
        return {
            "seo_analyses": seo_analyses,
            "keyword_research": 5,  # Simulated
            "competitor_analyses": 2,  # Simulated
            "api_calls": 45  # Simulated
        }

# Service functions
async def get_subscription_plans() -> List[SubscriptionPlan]:
    """Get all available subscription plans"""
    return SubscriptionManager.get_all_plans()

async def create_subscription(db: AsyncSession, user_id: int, plan_id: str, billing_cycle: str = "monthly"):
    """Create a new subscription"""
    return await SubscriptionManager.create_subscription(db, user_id, plan_id, billing_cycle)

async def get_license_status(db: AsyncSession, user_id: int) -> LicenseStatus:
    """Get user's license status"""
    return await SubscriptionManager.get_user_license_status(db, user_id)

async def check_feature_access(db: AsyncSession, user_id: int, feature: str) -> bool:
    """Check if user has access to a specific feature"""
    license_status = await SubscriptionManager.get_user_license_status(db, user_id)
    return feature in license_status.features_available

async def validate_usage_limit(db: AsyncSession, user_id: int, resource_type: str) -> bool:
    """Validate if user can use a resource (hasn't exceeded limits)"""
    check_result = await SubscriptionManager.check_usage_limit(db, user_id, resource_type)
    return check_result["allowed"]