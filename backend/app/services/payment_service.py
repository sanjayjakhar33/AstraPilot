from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.payment import Payment

async def create_payment(db: AsyncSession, user_id: int, provider: str, amount: float, currency: str, status: str = "pending"):
    payment = Payment(
        user_id=user_id,
        provider=provider,
        amount=amount,
        currency=currency,
        status=status
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment

async def get_payments_for_user(db: AsyncSession, user_id: int):
    q = await db.execute(select(Payment).where(Payment.user_id == user_id))
    return q.scalars().all()

async def set_payment_status(db: AsyncSession, payment_id: int, status: str):
    q = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = q.scalars().first()
    if payment:
        payment.status = status
        await db.commit()
        await db.refresh(payment)
    return payment
