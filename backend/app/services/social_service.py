from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.social import Social

async def add_social_profile(db: AsyncSession, user_id: int, platform: str, profile_url: str, social_data: dict):
    social_obj = Social(
        user_id=user_id,
        platform=platform,
        profile_url=profile_url,
        social_data=social_data
    )
    db.add(social_obj)
    await db.commit()
    await db.refresh(social_obj)
    return social_obj

async def get_social_profiles(db: AsyncSession, user_id: int):
    q = await db.execute(select(Social).where(Social.user_id == user_id))
    return q.scalars().all()
