from fpdf import FPDF
from datetime import datetime
import os

def generate_invoice_pdf(order) -> str:
    """Generate a professional light-themed invoice PDF with clean styling"""
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Light-themed color palette (RGB)
    VIOLET = (124, 58, 237)      # Accent color
    DARK_TEXT = (17, 24, 39)     # Main text
    GRAY_TEXT = (85, 85, 85)     # Secondary text
    LIGHT_ACCENT = (245, 245, 245)  # Table row alternation
    HEADER_BG = (240, 240, 250)     # Header background for table
    
    # ===== HEADER =====
    pdf.set_font("Arial", "B", 28)
    pdf.set_text_color(*DARK_TEXT)
    pdf.set_xy(15, 15)
    pdf.cell(0, 12, "INVOICE", ln=True)
    
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.set_xy(15, 35)
    pdf.cell(0, 5, f"Invoice Number: #{order.id}", ln=True)
    pdf.set_xy(15, 40)
    pdf.cell(0, 5, f"Issue Date: {datetime.now().strftime('%B %d, %Y')}", ln=True)
    
    # ===== CUSTOMER SECTION =====
    pdf.ln(12)
    pdf.set_font("Arial", "B", 12)
    pdf.set_text_color(*VIOLET)
    pdf.cell(0, 7, "BILL TO", ln=True)
    
    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(*DARK_TEXT)
    pdf.cell(0, 6, f"{order.user.name}", ln=True)
    
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.cell(0, 5, f"{order.user.email}", ln=True)
    
    # ===== TABLE HEADER =====
    pdf.ln(8)
    pdf.set_fill_color(*HEADER_BG)
    pdf.set_draw_color(*VIOLET)
    pdf.set_line_width(0.5)
    pdf.set_font("Arial", "B", 10)
    pdf.set_text_color(*DARK_TEXT)
    
    pdf.cell(90, 11, "PRODUCT DESCRIPTION", border=1, align="L", fill=True)
    pdf.cell(28, 11, "PRICE", border=1, align="C", fill=True)
    pdf.cell(22, 11, "QTY", border=1, align="C", fill=True)
    pdf.cell(35, 11, "AMOUNT", border=1, align="R", fill=True)
    pdf.ln()
    
    # ===== ITEMS =====
    pdf.set_font("Arial", "", 10)
    pdf.set_draw_color(*VIOLET)
    pdf.set_line_width(0.2)
    
    total = 0
    row_count = 0
    for item in order.items:
        # Alternating row background
        if row_count % 2 == 0:
            pdf.set_fill_color(*LIGHT_ACCENT)
        else:
            pdf.set_fill_color(255, 255, 255)
        
        item_total = item.unit_price * item.quantity
        product_name = item.product.name[:45] + "..." if len(item.product.name) > 45 else item.product.name
        
        pdf.cell(90, 10, product_name, border=1, align="L", fill=True)
        pdf.cell(28, 10, f"Rs. {item.unit_price:.2f}", border=1, align="C", fill=True)
        pdf.set_font("Arial", "B", 10)
        pdf.cell(22, 10, str(item.quantity), border=1, align="C", fill=True)
        pdf.cell(35, 10, f"Rs. {item_total:.2f}", border=1, align="R", fill=True)
        pdf.ln()
        
        total += item_total
        row_count += 1
    
    # ===== TOTALS =====
    pdf.ln(5)
    
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.set_xy(110, pdf.get_y())
    pdf.cell(40, 7, "Subtotal:", align="R")
    pdf.set_text_color(*DARK_TEXT)
    pdf.cell(35, 7, f"Rs. {total:.2f}", align="R", ln=True)
    
    tax = total * 0.10
    pdf.set_text_color(*GRAY_TEXT)
    pdf.set_xy(110, pdf.get_y())
    pdf.cell(40, 7, "Tax (10%):", align="R")
    pdf.set_text_color(*DARK_TEXT)
    pdf.cell(35, 7, f"Rs. {tax:.2f}", align="R", ln=True)
    
    pdf.ln(2)
    current_y = pdf.get_y()
    pdf.set_draw_color(*VIOLET)
    pdf.set_line_width(0.5)
    pdf.line(110, current_y, 195, current_y)
    
    pdf.ln(3)
    final_total = total + tax
    pdf.set_fill_color(*VIOLET)
    pdf.set_draw_color(*VIOLET)
    pdf.set_line_width(0.8)
    pdf.set_font("Arial", "B", 13)
    pdf.set_text_color(255, 255, 255)
    
    pdf.set_xy(110, pdf.get_y())
    pdf.cell(85, 12, f"TOTAL: Rs. {final_total:.2f}", align="R", fill=True, border=1)
    
    # ===== FOOTER =====
    pdf.ln(15)
    pdf.set_font("Arial", "I", 10)
    pdf.set_text_color(*DARK_TEXT)
    pdf.cell(0, 6, "Thank you for your business!", align="C", ln=True)
    
    pdf.set_font("Arial", "", 9)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.cell(0, 5, "For inquiries, contact us at support@company.com", align="C", ln=True)
    
    # ===== SAVE PDF =====
    pdf_folder = "invoices"
    os.makedirs(pdf_folder, exist_ok=True)
    pdf_path = os.path.join(pdf_folder, f"invoice_{order.id}.pdf")
    pdf.output(pdf_path)
    
    return pdf_path
