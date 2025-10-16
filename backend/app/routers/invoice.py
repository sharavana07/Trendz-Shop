from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.orders import Order
from app.models.users import User  # import User model

router = APIRouter()

@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Fetch the user linked to the order
    user = db.query(User).filter(User.id == order.user_id).first()
    
    return {
        "order_id": str(order.id),
        "user_name": user.name if user else "Guest",
        "user_email": user.email if user else "guest@example.com",
        "total_price": order.total_price,
        "items": [
            {"name": item.product_name, "price": item.price, "quantity": item.quantity}
            for item in order.items
        ],
    }
