# backend/app/utils/pdf_generator.py

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
import os

def generate_invoice_pdf(order_data: dict):
    try:
        print("Generating invoice for:", order_data)

        invoice_dir = "invoices"
        os.makedirs(invoice_dir, exist_ok=True)

        order_id = order_data.get("order_id", "UNKNOWN")
        user_name = order_data.get("user_name", "Customer")
        user_email = order_data.get("user_email", "Not Provided")
        items = order_data.get("items", [])

        invoice_name = f"invoice_{order_id}.pdf"
        invoice_path = os.path.join(invoice_dir, invoice_name)

        c = canvas.Canvas(invoice_path, pagesize=A4)
        width, height = A4

        # --- [Color Palette Setup, Header Drawing, etc.] ---
        # (Keep your original style code unchanged up to the first text draw)

        # Replace all dictionary key lookups with safe versions
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 32)
        c.drawString(50, height - 55, "Trendz Shop")

        # Customer card section
        y = height - 150
        card_height = 90
        c.roundRect(40, y - card_height, 250, card_height, 12, fill=1, stroke=1)
        c.setFont("Helvetica-Bold", 13)
        c.setFillColor(colors.black)
        c.drawString(55, y - 45, str(user_name))
        c.setFont("Helvetica", 10)
        c.drawString(55, y - 62, str(user_email))

        # Product table loop
        y -= 180
        total = 0
        for i, item in enumerate(items):
            name = item.get("name", "Unnamed Product")
            price = float(item.get("price", 0))
            qty = int(item.get("quantity", 1))
            line_total = price * qty
            total += line_total

            # Example drawing line
            c.drawString(50, y, name)
            c.drawString(250, y, str(qty))
            c.drawString(350, y, f"₹{price:.2f}")
            c.drawString(450, y, f"₹{line_total:.2f}")
            y -= 20

        # Grand total
        c.setFont("Helvetica-Bold", 14)
        c.drawString(350, y - 20, f"GRAND TOTAL: ₹{total:,.2f}")

        c.save()
        print(f"✅ Invoice generated: {invoice_path}")
        return invoice_path

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e
