import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financial_tracker.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    class Config:
        env_file = ".env"

settings = Settings()

# Build CORS origins list
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    settings.FRONTEND_URL,
    "https://*.vercel.app",
]

# Remove duplicates
CORS_ORIGINS = list(set(CORS_ORIGINS))
