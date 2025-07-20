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

settings = Settings()
