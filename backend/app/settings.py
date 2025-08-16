import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME = "1clickseo API"
    PROJECT_DESC = "Ultra-rich SEO & AI SaaS backend"
    PROJECT_VERSION = "0.1.0"
    SECRET_KEY = os.getenv("SECRET_KEY", "REPLACE_ME")
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # one week
    SQLALCHEMY_DATABASE_URL = os.getenv(
        "DATABASE_URL", "sqlite+aiosqlite:///./app.db"
    )
    
    # Email Configuration
    SMTP_HOST = os.getenv("SMTP_HOST", "smtp.zoho.in")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "info@astranetix.in")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "8k6UW8zPfU3g")
    SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "info@astranetix.in")
    
    # OTP Configuration
    OTP_EXPIRE_MINUTES = int(os.getenv("OTP_EXPIRE_MINUTES", "10"))

settings = Settings()
