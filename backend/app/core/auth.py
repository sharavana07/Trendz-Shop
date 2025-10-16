# app/core/auth.py
from fastapi import Depends, HTTPException
from app.models.users import User
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Dummy example: replace with your  actual JWT/session logic
    user = ...  # fetch user by token
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user
