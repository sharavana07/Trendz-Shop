from pydantic import BaseModel
from typing import List

class InvoiceItem(BaseModel):
    name: str
    price: float
    quantity: int

class InvoiceRequest(BaseModel):
    order_id: int
    customer_name: str
    items: List[InvoiceItem]
    total: float
