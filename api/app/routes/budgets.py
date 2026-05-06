from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models import Budget, Transaction, User
from app.schemas import Budget as BudgetSchema, BudgetCreate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.get("", response_model=list[BudgetSchema])
def get_budgets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = datetime.utcnow()
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == today.month,
        Budget.year == today.year
    ).all()
    
    # Calculate spent amount for each budget
    for budget in budgets:
        transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id,
            Transaction.category == budget.category,
            Transaction.type == "expense",
            Transaction.date >= datetime(today.year, today.month, 1)
        ).all()
        budget.spent = sum(t.amount for t in transactions)
    
    return budgets

@router.post("", response_model=BudgetSchema)
def create_budget(budget: BudgetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = datetime.utcnow()
    db_budget = Budget(
        user_id=current_user.id,
        category=budget.category,
        limit=budget.limit,
        month=today.month,
        year=today.year
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.delete("/{budget_id}")
def delete_budget(budget_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    db.delete(db_budget)
    db.commit()
    return {"message": "Budget deleted"}
