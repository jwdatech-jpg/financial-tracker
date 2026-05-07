import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings - reads from environment variables"""
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financial_tracker.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-use-a-strong-random-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

# Build CORS origins list dynamically
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    settings.FRONTEND_URL,
]

# Add Vercel domain patterns if in production
if "vercel.app" in settings.FRONTEND_URL:
    CORS_ORIGINS.extend([
        "https://project-p4w6b.vercel.app",
        "https://*.vercel.app",
    ])

# Remove duplicates and empty strings
CORS_ORIGINS = list(set([url for url in CORS_ORIGINS if url]))

# Ensure HTTPS in production
if "vercel" in settings.FRONTEND_URL or "production" in os.getenv("VERCEL_ENV", ""):
    # Add HTTP versions for localhost only
    pass
