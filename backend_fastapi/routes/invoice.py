from schemas import Invoice
from database import invoice_collection
from fastapi import APIRouter, HTTPException
from bson import ObjectId
import io
from fastapi.responses import StreamingResponse
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer,Table
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

#router for invoice-related endpoints
router = APIRouter()

# Endpoint to create a new invoice
@router.post("/invoices")
def create_invoice(invoice: Invoice):

    # Convert the Pydantic model to a dictionary and insert into MongoDB
    invoice_dict = invoice.model_dump()
    result = invoice_collection.insert_one(invoice_dict)
    return {
        "message": "Invoice created successfully", 
        "invoice_id": str(result.inserted_id)
        }

# Endpoint to get all invoices
@router.get("/invoices")
def get_invoices():

    invoices= []
    
    for invoice in invoice_collection.find():
        invoice["id"]= str(invoice["_id"])
        del invoice["_id"]
        invoices.append(invoice)
    return invoices

# Endpoint to get a specific invoice by ID
@router.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: str):

    invoice = invoice_collection.find_one({"_id": ObjectId(invoice_id)})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice["_id"] = str(invoice["_id"])
    return invoice

# Endpoint to delete an invoice by ID
@router.delete("/invoices/{invoice_id}")
def delete_invoice(invoice_id: str):

    result = invoice_collection.delete_one({"_id": ObjectId(invoice_id)})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice deleted successfully"}

# Endpoint to generate PDF for a specific invoice
@router.get("/invoices/{invoice_id}/pdf")
def download_invoice(invoice_id: str):

    invoice = invoice_collection.find_one({"_id": ObjectId(invoice_id)})

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(Paragraph(f"Invoice: {invoice['invoice_number']}", styles["Title"]))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph(f"Vendor: {invoice['vendor_name']}", styles["Normal"]))
    elements.append(Paragraph(f"Email: {invoice['vendor_email']}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    data = [["Part", "Brand", "Qty", "Unit Price", "Total"]]

    for item in invoice["items"]:
        data.append([
            item["part_name"],
            item["brand"],
            item["quantity"],
            item["unit_price"],
            item["total"]
        ])

    table = Table(data)

    table.setStyle([
        ("GRID", (0,0), (-1,-1), 1, colors.black)
    ])

    elements.append(table)

    elements.append(Spacer(1,20))

    elements.append(Paragraph(f"Subtotal: {invoice['subtotal']}", styles["Normal"]))
    elements.append(Paragraph(f"GST: {invoice['gst']}", styles["Normal"]))
    elements.append(Paragraph(f"Grand Total: {invoice['grand_total']}", styles["Normal"]))

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Invoice_{invoice['invoice_number']}.pdf"
        }
    )