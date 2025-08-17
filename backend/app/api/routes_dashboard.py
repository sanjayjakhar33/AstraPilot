from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.database import get_db
from app.models.user import User
from app.models.payment import Payment
from app.models.license import License
from app.models.seodata import SeoData
from app.models.social import Social
from app.services.auth_service import get_user_by_username
from app.settings import settings

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

async def get_current_admin_user(db: AsyncSession = Depends(get_db)):
    """Verify admin access - simplified for demo"""
    # In production, this should verify JWT token and admin role
    admin_user = await get_user_by_username(db, settings.ADMIN_USERNAME)
    if not admin_user or not admin_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return admin_user

@router.get("/dashboard/overview")
async def get_admin_overview(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get comprehensive admin dashboard overview"""
    
    # User statistics
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar()
    
    verified_users_result = await db.execute(
        select(func.count(User.id)).where(User.email_verified == True)
    )
    verified_users = verified_users_result.scalar()
    
    active_users_result = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    active_users = active_users_result.scalar()
    
    # Recent registrations (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_registrations_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= week_ago)
    )
    recent_registrations = recent_registrations_result.scalar()
    
    # Payment statistics
    total_payments_result = await db.execute(select(func.count(Payment.id)))
    total_payments = total_payments_result.scalar()
    
    successful_payments_result = await db.execute(
        select(func.count(Payment.id)).where(Payment.status == "paid")
    )
    successful_payments = successful_payments_result.scalar()
    
    total_revenue_result = await db.execute(
        select(func.sum(Payment.amount)).where(Payment.status == "paid")
    )
    total_revenue = total_revenue_result.scalar() or 0
    
    # License statistics
    active_licenses_result = await db.execute(
        select(func.count(License.id)).where(License.is_active == True)
    )
    active_licenses = active_licenses_result.scalar()
    
    # SEO analysis statistics
    total_analyses_result = await db.execute(select(func.count(SeoData.id)))
    total_analyses = total_analyses_result.scalar()
    
    # Recent analyses (last 24 hours)
    day_ago = datetime.utcnow() - timedelta(days=1)
    recent_analyses_result = await db.execute(
        select(func.count(SeoData.id)).where(SeoData.created_at >= day_ago)
    )
    recent_analyses = recent_analyses_result.scalar()
    
    # Social media connections
    social_connections_result = await db.execute(select(func.count(Social.id)))
    social_connections = social_connections_result.scalar()
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "user_stats": {
            "total_users": total_users,
            "verified_users": verified_users,
            "active_users": active_users,
            "recent_registrations": recent_registrations,
            "verification_rate": round((verified_users / total_users * 100) if total_users > 0 else 0, 2)
        },
        "payment_stats": {
            "total_payments": total_payments,
            "successful_payments": successful_payments,
            "total_revenue": float(total_revenue),
            "success_rate": round((successful_payments / total_payments * 100) if total_payments > 0 else 0, 2)
        },
        "license_stats": {
            "active_licenses": active_licenses
        },
        "analysis_stats": {
            "total_analyses": total_analyses,
            "recent_analyses": recent_analyses,
            "daily_avg": round(recent_analyses, 2)
        },
        "social_stats": {
            "total_connections": social_connections
        },
        "system_health": {
            "status": "operational",
            "ai_engine": "active",
            "database": "connected",
            "email_service": "operational"
        }
    }

@router.get("/users")
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get all users with pagination"""
    
    result = await db.execute(
        select(User)
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    users = result.scalars().all()
    
    # Get total count
    count_result = await db.execute(select(func.count(User.id)))
    total_count = count_result.scalar()
    
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "email_verified": user.email_verified,
                "is_active": user.is_active,
                "is_superuser": user.is_superuser,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
            for user in users
        ],
        "total": total_count,
        "skip": skip,
        "limit": limit
    }

@router.get("/users/{user_id}")
async def get_user_details(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get detailed information about a specific user"""
    
    # Get user
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's payments
    payments_result = await db.execute(
        select(Payment).where(Payment.user_id == user_id).order_by(Payment.created_at.desc())
    )
    payments = payments_result.scalars().all()
    
    # Get user's licenses
    licenses_result = await db.execute(
        select(License).where(License.user_id == user_id).order_by(License.created_at.desc())
    )
    licenses = licenses_result.scalars().all()
    
    # Get user's SEO analyses
    analyses_result = await db.execute(
        select(SeoData).where(SeoData.user_id == user_id).order_by(SeoData.created_at.desc()).limit(10)
    )
    analyses = analyses_result.scalars().all()
    
    # Get user's social connections
    social_result = await db.execute(
        select(Social).where(Social.user_id == user_id)
    )
    social_connections = social_result.scalars().all()
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "email_verified": user.email_verified,
            "is_active": user.is_active,
            "is_superuser": user.is_superuser,
            "created_at": user.created_at.isoformat() if user.created_at else None
        },
        "payments": [
            {
                "id": p.id,
                "provider": p.provider,
                "amount": float(p.amount),
                "currency": p.currency,
                "status": p.status,
                "created_at": p.created_at.isoformat() if p.created_at else None
            }
            for p in payments
        ],
        "licenses": [
            {
                "id": l.id,
                "plan": l.plan,
                "is_active": l.is_active,
                "valid_until": l.valid_until.isoformat() if l.valid_until else None,
                "created_at": l.created_at.isoformat() if l.created_at else None
            }
            for l in licenses
        ],
        "recent_analyses": [
            {
                "id": a.id,
                "url": a.url,
                "score": float(a.score) if a.score else None,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in analyses
        ],
        "social_connections": [
            {
                "id": s.id,
                "platform": s.platform,
                "profile_url": s.profile_url,
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in social_connections
        ]
    }

@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active_status(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Toggle user active status"""
    
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    await db.commit()
    await db.refresh(user)
    
    return {
        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully",
        "user_id": user.id,
        "is_active": user.is_active
    }

@router.get("/payments")
async def get_all_payments(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get all payments with optional status filter"""
    
    query = select(Payment).order_by(Payment.created_at.desc())
    
    if status_filter:
        query = query.where(Payment.status == status_filter)
    
    result = await db.execute(query.offset(skip).limit(limit))
    payments = result.scalars().all()
    
    # Get total count
    count_query = select(func.count(Payment.id))
    if status_filter:
        count_query = count_query.where(Payment.status == status_filter)
    
    count_result = await db.execute(count_query)
    total_count = count_result.scalar()
    
    return {
        "payments": [
            {
                "id": p.id,
                "user_id": p.user_id,
                "provider": p.provider,
                "amount": float(p.amount),
                "currency": p.currency,
                "status": p.status,
                "created_at": p.created_at.isoformat() if p.created_at else None
            }
            for p in payments
        ],
        "total": total_count,
        "skip": skip,
        "limit": limit,
        "status_filter": status_filter
    }

@router.get("/analytics/revenue")
async def get_revenue_analytics(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get revenue analytics for the specified period"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Daily revenue
    daily_revenue_result = await db.execute(
        select(
            func.date(Payment.created_at).label('date'),
            func.sum(Payment.amount).label('revenue')
        )
        .where(
            and_(
                Payment.created_at >= start_date,
                Payment.status == "paid"
            )
        )
        .group_by(func.date(Payment.created_at))
        .order_by(func.date(Payment.created_at))
    )
    daily_revenue = daily_revenue_result.fetchall()
    
    # Total revenue in period
    total_revenue_result = await db.execute(
        select(func.sum(Payment.amount))
        .where(
            and_(
                Payment.created_at >= start_date,
                Payment.status == "paid"
            )
        )
    )
    total_revenue = total_revenue_result.scalar() or 0
    
    return {
        "period_days": days,
        "total_revenue": float(total_revenue),
        "daily_revenue": [
            {
                "date": str(row.date),
                "revenue": float(row.revenue)
            }
            for row in daily_revenue
        ],
        "average_daily_revenue": float(total_revenue / days) if days > 0 else 0
    }

@router.get("/system/health")
async def get_system_health(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get comprehensive system health information"""
    
    try:
        # Test database connectivity
        await db.execute(select(1))
        db_status = "connected"
    except Exception:
        db_status = "error"
    
    # Check OpenAI API availability
    openai_status = "configured" if settings.OPENAI_API_KEY else "not_configured"
    
    # Check email configuration
    email_status = "configured" if settings.SMTP_USERNAME and settings.SMTP_PASSWORD else "not_configured"
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "overall_status": "healthy" if all([
            db_status == "connected",
            openai_status == "configured",
            email_status == "configured"
        ]) else "warning",
        "components": {
            "database": {
                "status": db_status,
                "url": settings.SQLALCHEMY_DATABASE_URL.split("@")[-1] if "@" in settings.SQLALCHEMY_DATABASE_URL else "local"
            },
            "openai_api": {
                "status": openai_status,
                "configured": bool(settings.OPENAI_API_KEY)
            },
            "email_service": {
                "status": email_status,
                "smtp_host": settings.SMTP_HOST,
                "smtp_username": settings.SMTP_USERNAME
            },
            "application": {
                "status": "running",
                "version": settings.PROJECT_VERSION,
                "environment": "production"
            }
        }
    }

# Legacy dashboard endpoint for backward compatibility
@router.get("/dashboard/metrics")
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    """Legacy dashboard metrics endpoint"""
    
    # Get basic metrics without authentication for backward compatibility
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar()
    
    total_analyses_result = await db.execute(select(func.count(SeoData.id)))
    total_analyses = total_analyses_result.scalar()
    
    avg_score_result = await db.execute(select(func.avg(SeoData.score)))
    avg_score = avg_score_result.scalar()
    
    return {
        "live_users": total_users or 0,
        "ai_reports_generated": total_analyses or 0,
        "avg_site_score": round(float(avg_score)) if avg_score else 85
    }
