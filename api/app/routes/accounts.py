from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Account, User
from app.schemas import Account as AccountSchema, AccountCreate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("", response_model=list[AccountSchema])
def get_accounts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Account).filter(Account.user_id == current_user.id).all()

@router.post("", response_model=AccountSchema)
def create_account(account: AccountCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_account = Account(
        user_id=current_user.id,
        name=account.name,
        type=account.type,
        balance=account.initial_balance,
        initial_balance=account.initial_balance
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.put("/{account_id}", response_model=AccountSchema)
def update_account(account_id: int, account: AccountCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_account = db.query(Account).filter(Account.id == account_id, Account.user_id == current_user.id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    db_account.name = account.name
    db_account.type = account.type
    db.commit()
    db.refresh(db_account)
    return db_account

@router.delete("/{account_id}")
def delete_account(account_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_account = db.query(Account).filter(Account.id == account_id, Account.user_id == current_user.id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    db.delete(db_account)
    db.commit()
    return {"message": "Account deleted"}
