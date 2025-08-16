from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate, UserResponse, OTPVerificationRequest, OTPSendRequest, OTPResponse
from app.services.auth_service import create_user, authenticate_user, create_access_token, get_user_by_id
from app.services.otp_service import verify_otp, resend_otp
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=201, response_model=dict)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await create_user(db, user)
    if not db_user:
        raise HTTPException(
            status_code=409, 
            detail="Username or email already exists"
        )
    return {
        "message": "User registered successfully. Please check your email for verification code.",
        "user_id": db_user.id,
        "email_verified": db_user.email_verified
    }

@router.post("/verify-email", response_model=OTPResponse)
async def verify_email(
    request: OTPVerificationRequest, 
    db: AsyncSession = Depends(get_db)
):
    success = await verify_otp(db, request.user_id, request.otp_code)
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP code"
        )
    return OTPResponse(
        success=True,
        message="Email verified successfully"
    )

@router.post("/resend-otp", response_model=OTPResponse)
async def resend_otp_endpoint(
    request: OTPSendRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_by_id(db, request.user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    if user.email_verified:
        raise HTTPException(
            status_code=400,
            detail="Email already verified"
        )
    
    success = await resend_otp(db, request.user_id)
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP. Please try again."
        )
    
    return OTPResponse(
        success=True,
        message="OTP sent successfully"
    )

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Incorrect username or password"
        )
    
    # Check if email is verified
    if not user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please verify your email before logging in."
        )
    
    token = create_access_token({"sub": user.username})
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "email_verified": user.email_verified
        }
    }
