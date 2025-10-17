from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.orders import Order, OrderItem  # <- make sure OrderItem is imported
from app.utils.pdf_generator import generate_invoice_pdf
import os

router = APIRouter(prefix="/invoice", tags=["Invoice"])

# ✅ Return full order details including items
@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Fetch related items
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    items_data = [
        {
            "name": f"Product {item.product_id}",  # optionally fetch product name from product table
            "price": item.unit_price,
            "quantity": item.quantity
        }
        for item in items
    ]

    return {
        "order_id": order.id,
        "user_id": order.user_id,
        "user_name": f"User {order.user_id}",  # optionally fetch real user name
        "user_email": "guest@example.com",     # optionally fetch real email
        "items": items_data,
        "total_price": order.total_price
    }

# 🚀 Generate PDF invoice
@router.post("/generate/{order_id}")
def generate_invoice(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Fetch items for PDF
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    order.items = items  # attach items to order object so PDF generator can use them

    pdf_path = generate_invoice_pdf(order)  # should return full file path
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="Invoice generation failed")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"invoice_{order_id}.pdf"
    )
