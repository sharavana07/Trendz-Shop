from fpdf import FPDF
from datetime import datetime
import os

def generate_invoice_pdf(order) -> str:
    """Generate a professional invoice PDF with modern styling (₹ handled safely)"""
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Define color palette (RGB)
    VIOLET = (124, 58, 237)
    DARK_BG = (17, 24, 39)
    LIGHT_TEXT = (249, 250, 251)
    GRAY_TEXT = (209, 213, 219)
    
    # ===== HEADER =====
    pdf.set_fill_color(*VIOLET)
    pdf.rect(0, 0, 210, 5, 'F')
    
    pdf.set_font("Arial", "B", 24)
    pdf.set_text_color(*LIGHT_TEXT)
    pdf.set_xy(15, 12)
    pdf.cell(0, 10, "INVOICE", ln=True)
    
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.set_xy(15, 24)
    pdf.cell(0, 5, f"Invoice #{order.id}", ln=True)
    pdf.set_xy(15, 29)
    pdf.cell(0, 5, f"Date: {datetime.now().strftime('%B %d, %Y')}", ln=True)
    
    # ===== CUSTOMER =====
    pdf.ln(8)
    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(*LIGHT_TEXT)
    pdf.cell(0, 7, "BILL TO:", ln=True)
    
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.cell(0, 5, f"{order.user.name}", ln=True)
    pdf.cell(0, 5, f"{order.user.email}", ln=True)
    
    # ===== TABLE HEADER =====
    pdf.ln(5)
    pdf.set_fill_color(*VIOLET)
    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(85, 10, "Product", border=1, align="L", fill=True)
    pdf.cell(30, 10, "Price", border=1, align="C", fill=True)
    pdf.cell(25, 10, "Qty", border=1, align="C", fill=True)
    pdf.cell(35, 10, "Total", border=1, align="R", fill=True)
    pdf.ln()
    
    # ===== ITEMS =====
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*LIGHT_TEXT)
    total = 0
    row_count = 0

    for item in order.items:
        if row_count % 2 == 0:
            pdf.set_fill_color(25, 30, 45)
        else:
            pdf.set_fill_color(17, 24, 39)
        
        item_total = item.unit_price * item.quantity
        pdf.cell(85, 9, item.product.name[:40], border=1, align="L", fill=True)
        pdf.cell(30, 9, f"Rs.{item.unit_price:.2f}", border=1, align="C", fill=True)
        pdf.cell(25, 9, str(item.quantity), border=1, align="C", fill=True)
        pdf.cell(35, 9, f"Rs.{item_total:.2f}", border=1, align="R", fill=True)
        pdf.ln()
        total += item_total
        row_count += 1

    # ===== TOTALS =====
    pdf.ln(3)
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.set_xy(100, pdf.get_y())
    pdf.cell(45, 6, "Subtotal:", align="R")
    pdf.cell(35, 6, f"Rs.{total:.2f}", align="R", ln=True)
    
    tax = total * 0.10
    pdf.set_xy(100, pdf.get_y())
    pdf.cell(45, 6, "Tax (10%):", align="R")
    pdf.cell(35, 6, f"Rs.{tax:.2f}", align="R", ln=True)
    
    pdf.ln(2)
    final_total = total + tax
    pdf.set_fill_color(*VIOLET)
    pdf.set_font("Arial", "B", 12)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(145, 10, f"TOTAL: Rs.{final_total:.2f}", align="R", fill=True, border=1)
    
    # ===== FOOTER =====
    pdf.ln(10)
    pdf.set_font("Arial", "", 9)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.cell(0, 5, "Thank you for your business!", align="C", ln=True)
    pdf.cell(0, 5, "For inquiries, contact us at support@company.com", align="C", ln=True)
    pdf.ln(5)
    pdf.set_fill_color(*VIOLET)
    pdf.rect(0, pdf.h - 5, 210, 5, 'F')
    
    # ===== SAVE PDF =====
    pdf_folder = "invoices"
    os.makedirs(pdf_folder, exist_ok=True)
    pdf_path = os.path.join(pdf_folder, f"invoice_{order.id}.pdf")
    pdf.output(pdf_path)
    
    return pdf_path
