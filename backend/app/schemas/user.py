from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    email_verified: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class User(UserInDB):
    pass

class UserResponse(UserBase):
    id: int
    is_active: bool
    email_verified: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# OTP-related schemas
class OTPVerificationRequest(BaseModel):
    user_id: int
    otp_code: str

class OTPSendRequest(BaseModel):
    user_id: int

class OTPResponse(BaseModel):
    success: bool
    message: str