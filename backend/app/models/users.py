from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from sqlalchemy.orm import relationship  # <- THIS WAS MISSING
from app.core.database import Base  # Make sure you have Base defined in database.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200))
    role = Column(String(50), default="user")
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    orders = relationship("Order", back_populates="user")
