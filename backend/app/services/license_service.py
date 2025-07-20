from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from app.models.license import License

async def create_license(db: AsyncSession, user_id: int, plan: str, valid_days: int = 30):
    valid_until = datetime.utcnow() + timedelta(days=valid_days)
    license = License(
        user_id=user_id,
        plan=plan,
        is_active=True,
        valid_until=valid_until
    )
    db.add(license)
    await db.commit()
    await db.refresh(license)
    return license

async def get_license_for_user(db: AsyncSession, user_id: int):
    q = await db.execute(select(License).where(License.user_id == user_id, License.is_active == True))
    return q.scalars().first()

async def deactivate_expired_licenses(db: AsyncSession):
    now = datetime.utcnow()
    q = await db.execute(select(License).where(License.valid_until < now, License.is_active == True))
    for license in q.scalars():
        license.is_active = False
    await db.commit()
