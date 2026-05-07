"""Initialize database schema on startup"""
import os
import sys
from sqlalchemy import create_engine
from app.core.config import settings
from app.models.models import Base

def init_db():
    """Create all database tables"""
    try:
        engine = create_engine(settings.DATABASE_URL, echo=False)
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized successfully!")
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

if __name__ == "__main__":
    init_db()
