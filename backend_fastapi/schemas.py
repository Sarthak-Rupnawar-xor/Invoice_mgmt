from pydantic import BaseModel
from typing import List
from pydantic import EmailStr


# Define Pydantic models for request and response bodies
class Item(BaseModel):
    part_name: str
    brand: str
    quantity: int
    unit_price: float
    total: float

# Define the Invoice model
class Invoice(BaseModel):
    invoice_number: str
    vendor_name: str
    vendor_email: EmailStr
    items: List[Item]
    subtotal: float
    gst: float
    grand_total: float

#validate email format

