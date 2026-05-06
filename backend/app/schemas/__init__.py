from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: Optional[str] = None
    currency: Optional[str] = "USD"
    country: Optional[str] = "US"

class User(UserBase):
    id: int
    name: Optional[str]
    language: str
    currency: str
    country: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = None
    currency: Optional[str] = None
    country: Optional[str] = None
    password: Optional[str] = None

class AccountCreate(BaseModel):
    name: str
    type: str
    initial_balance: float = 0

class Account(BaseModel):
    id: int
    name: str
    type: str
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    type: str
    category: str
    amount: float
    description: Optional[str] = None
    notes: Optional[str] = None
    date: datetime
    recurring: bool = False
    frequency: str = "never"
    account_id: Optional[int] = None

class Transaction(BaseModel):
    id: int
    type: str
    category: str
    amount: float
    description: Optional[str]
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetCreate(BaseModel):
    category: str
    limit: float

class Budget(BaseModel):
    id: int
    category: str
    limit: float
    spent: float
    created_at: datetime

    class Config:
        from_attributes = True

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    deadline: datetime

class Goal(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    deadline: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
