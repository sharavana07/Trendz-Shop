# backend/app/routers/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.users import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return {"error": "No users found in database."}
    return user
@router.get("/user/{email}")
def get_user_orders(email: str, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_email == email).all()
    return orders