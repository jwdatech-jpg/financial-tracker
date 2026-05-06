from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models import Transaction, Account, User
from app.schemas import Transaction as TransactionSchema, TransactionCreate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("", response_model=list[TransactionSchema])
def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).all()

@router.post("", response_model=TransactionSchema)
def create_transaction(transaction: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get first account if not specified
    account = db.query(Account).filter(Account.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=400, detail="No account found")
    
    db_transaction = Transaction(
        user_id=current_user.id,
        account_id=account.id,
        type=transaction.type,
        category=transaction.category,
        amount=transaction.amount,
        description=transaction.description,
        notes=transaction.notes,
        date=transaction.date,
        recurring=transaction.recurring,
        frequency=transaction.frequency
    )
    
    # Update account balance
    if transaction.type == "income":
        account.balance += transaction.amount
    else:
        account.balance -= transaction.amount
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Reverse the balance update
    account = db.query(Account).get(db_transaction.account_id)
    if db_transaction.type == "income":
        account.balance -= db_transaction.amount
    else:
        account.balance += db_transaction.amount
    
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}
