import random
import string
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.utils.email import send_otp_email
from app.settings import settings

def generate_otp(length: int = 6) -> str:
    """Generate a random OTP code"""
    return ''.join(random.choices(string.digits, k=length))

async def create_and_send_otp(db: AsyncSession, user_id: int) -> bool:
    """Generate OTP and send via email"""
    try:
        # Get user
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            return False
        
        # Generate OTP
        otp_code = generate_otp()
        otp_expires = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        
        # Update user with OTP
        user.otp_code = otp_code
        user.otp_expires = otp_expires
        await db.commit()
        
        # Send email
        return send_otp_email(user.email, otp_code, user.username)
    except Exception as e:
        print(f"Error creating and sending OTP: {e}")
        return False

async def verify_otp(db: AsyncSession, user_id: int, otp_code: str) -> bool:
    """Verify OTP code and mark email as verified"""
    try:
        # Get user
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            return False
        
        # Check if OTP exists and is not expired
        if not user.otp_code or not user.otp_expires:
            return False
        
        if datetime.utcnow() > user.otp_expires:
            # OTP expired, clear it
            user.otp_code = None
            user.otp_expires = None
            await db.commit()
            return False
        
        # Verify OTP code
        if user.otp_code == otp_code:
            # Mark email as verified and clear OTP
            user.email_verified = True
            user.otp_code = None
            user.otp_expires = None
            await db.commit()
            return True
        
        return False
    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return False

async def resend_otp(db: AsyncSession, user_id: int) -> bool:
    """Resend OTP to user"""
    return await create_and_send_otp(db, user_id)