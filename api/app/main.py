from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.core.config import settings, CORS_ORIGINS
from app.routes import auth, accounts, transactions, budgets, goals, dashboard
from app.models import User, Account, Transaction, Budget, Goal
import os

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database schema created/verified")
except Exception as e:
    print(f"⚠️ Database initialization error (this may be normal in serverless): {e}")
    # Continue anyway - Vercel functions are stateless

app = FastAPI(
    title="Financial Tracker API",
    description="Personal Financial Tracker Backend API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Add CORS middleware FIRST (before routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(goals.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Financial Tracker API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "environment": "production"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
