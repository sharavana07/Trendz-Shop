from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.admin import Admin
from app.schemas.admin_schema import AdminCreate
import bcrypt

router = APIRouter(prefix="/api/admins", tags=["Admins"])

# Create admin
@router.post("/create")
def create_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(Admin).filter(Admin.username == admin.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = bcrypt.hashpw(admin.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    new_admin = Admin(username=admin.username, password_hash=hashed_pw)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"id": new_admin.id, "username": new_admin.username}

# Get all admins (for NextAuth login)
@router.get("/")
def get_admins(db: Session = Depends(get_db)):
    admins = db.query(Admin).all()
    return [
        {"id": a.id, "username": a.username, "password_hash": a.password_hash} 
        for a in admins
    ]
