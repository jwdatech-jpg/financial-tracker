from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Goal, User
from app.schemas import Goal as GoalSchema, GoalCreate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("", response_model=list[GoalSchema])
def get_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all()

@router.post("", response_model=GoalSchema)
def create_goal(goal: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_goal = Goal(
        user_id=current_user.id,
        name=goal.name,
        target_amount=goal.target_amount,
        deadline=goal.deadline
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.put("/{goal_id}", response_model=GoalSchema)
def update_goal(goal_id: int, goal: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db_goal.name = goal.name
    db_goal.target_amount = goal.target_amount
    db_goal.deadline = goal.deadline
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(db_goal)
    db.commit()
    return {"message": "Goal deleted"}
