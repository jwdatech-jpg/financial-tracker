from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models import Transaction, Account, User, Budget
from app.utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get total balance
    accounts = db.query(Account).filter(Account.user_id == current_user.id).all()
    total_balance = sum(acc.balance for acc in accounts)
    
    # Get this month's transactions
    today = datetime.utcnow()
    month_start = datetime(today.year, today.month, 1)
    month_end = month_start + timedelta(days=32)
    month_end = month_end.replace(day=1) - timedelta(days=1)
    
    income_txs = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        Transaction.date >= month_start,
        Transaction.date <= month_end
    ).scalar() or 0
    
    expense_txs = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= month_start,
        Transaction.date <= month_end
    ).scalar() or 0
    
    savings = income_txs - expense_txs
    
    # Get category breakdown
    category_breakdown = []
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= month_start,
        Transaction.date <= month_end,
        Transaction.type == "expense"
    ).all()
    
    by_category = {}
    for tx in transactions:
        if tx.category not in by_category:
            by_category[tx.category] = 0
        by_category[tx.category] += tx.amount
    
    for category, amount in by_category.items():
        category_breakdown.append({"name": category, "value": amount})
    
    # Get recent transactions
    recent = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.date.desc()).limit(5).all()
    
    recent_txs = [
        {
            "id": tx.id,
            "date": tx.date,
            "description": tx.description,
            "category": tx.category,
            "amount": tx.amount,
            "type": tx.type
        }
        for tx in recent
    ]
    
    return {
        "total_balance": total_balance,
        "total_income": income_txs,
        "total_expenses": expense_txs,
        "savings": savings,
        "category_breakdown": category_breakdown,
        "recent_transactions": recent_txs
    }

@router.get("/chart")
def get_chart_data(period: str = "month", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if period == "month":
        # Get last 12 months of data
        data = []
        today = datetime.utcnow()
        
        for i in range(11, -1, -1):
            month_date = today - timedelta(days=30*i)
            month_start = datetime(month_date.year, month_date.month, 1)
            month_end = month_start + timedelta(days=32)
            month_end = month_end.replace(day=1) - timedelta(days=1)
            
            income = db.query(func.sum(Transaction.amount)).filter(
                Transaction.user_id == current_user.id,
                Transaction.type == "income",
                Transaction.date >= month_start,
                Transaction.date <= month_end
            ).scalar() or 0
            
            expense = db.query(func.sum(Transaction.amount)).filter(
                Transaction.user_id == current_user.id,
                Transaction.type == "expense",
                Transaction.date >= month_start,
                Transaction.date <= month_end
            ).scalar() or 0
            
            data.append({
                "month": month_date.strftime("%b"),
                "income": income,
                "expenses": expense
            })
        
        return data
    
    return []
