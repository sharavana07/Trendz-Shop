# File: backend/app/routers/orders.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.product import Product
from app.models.orders import Order, OrderItem
from app.models.users import User

router = APIRouter()

@router.post("/create-order")
def create_order(order_data: dict, db: Session = Depends(get_db)):
    user_id = order_data.get("user_id")
    items = order_data.get("items", [])
    total_price = order_data.get("total_price", 0)

    if not user_id or not items:
        raise HTTPException(status_code=400, detail="user_id and items are required")

    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # 1️⃣ Create the order
        order = Order(user_id=user_id, total_price=total_price, payment_status="Pending")
        db.add(order)
        db.flush()  # Get order.id without committing

        # 2️⃣ Process each item
        for item in items:
            product_id = item.get("product_id")
            quantity = item.get("quantity", 0)
            unit_price = item.get("unit_price", 0)

            # Fetch product
            product = db.query(Product).filter(Product.id == product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

            if product.stock < quantity:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

            # Reduce stock
            product.stock -= quantity

            # Create order item
            order_item = OrderItem(order_id=order.id, product_id=product_id,
                                   quantity=quantity, unit_price=unit_price)
            db.add(order_item)

            # Optional: mark as unavailable if stock hits 0
            if product.stock <= 0:
                product.is_available = False

        db.commit()
        return {"message": "Order created successfully", "order_id": order.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
