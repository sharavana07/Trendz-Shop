
#FILE: backend/app/models/orders.py

from sqlalchemy import Column, Integer, ForeignKey, Float, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.users import User
from app.models.product import Product


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # only once!
    total_price = Column(Float, nullable=False)
    payment_status = Column(String, default="Pending")
    
    items = relationship("OrderItem", back_populates="order")
    user = relationship("User", back_populates="orders")  # use string to avoid circular import

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")  # ← add this!