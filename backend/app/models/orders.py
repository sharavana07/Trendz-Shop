# file: backend/app/models/orders.py
from sqlalchemy import Column, Integer, ForeignKey, Numeric, String, Text, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    total_price = Column(Numeric(10, 2), nullable=False)
    payment_status = Column(String(20), default="Pending")
    invoice_url = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationship to order items
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    # Optional: relationship to User (if you want to access user info)
    # from app.models.users import User
    # user = relationship("User", back_populates="orders")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)

    # Relationship back to the Order
    order = relationship("Order", back_populates="order_items")

    # Optional: relationship to Product (if you want to access product info)
    # from app.models.products import Product
    # product = relationship("Product")
