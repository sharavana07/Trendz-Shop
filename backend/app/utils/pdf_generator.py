from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import os

def generate_invoice(order_data):
    invoice_dir = "invoices"
    os.makedirs(invoice_dir, exist_ok=True)
    invoice_name = f"invoice_{order_data['order_id']}.pdf"
    invoice_path = os.path.join(invoice_dir, invoice_name)
    
    c = canvas.Canvas(invoice_path, pagesize=A4)
    width, height = A4
    
    # Define color palette
    violet = colors.Color(0.545, 0.361, 0.965)  # #8B5CF6
    dark_violet = colors.Color(0.176, 0.043, 0.369)  # #2D0B5E
    deep_black = colors.Color(0.051, 0.051, 0.051)  # #0D0D0D
    light_gray = colors.Color(0.95, 0.95, 0.97)
    border_gray = colors.Color(0.85, 0.85, 0.88)
    
    # ======= GRADIENT HEADER =======
    # Simulating gradient with overlapping rectangles
    header_height = 120
    for i in range(header_height):
        ratio = i / header_height
        r = 0.545 + (0.176 - 0.545) * ratio
        g = 0.361 + (0.043 - 0.361) * ratio
        b = 0.965 + (0.369 - 0.965) * ratio
        c.setFillColorRGB(r, g, b)
        c.rect(0, height - i - 1, width, 1, fill=1, stroke=0)
    
    # Header content
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(50, height - 55, "Trendz Shop")
    
    # Subtle line under brand
    c.setStrokeColor(colors.Color(1, 1, 1, 0.3))
    c.setLineWidth(2)
    c.line(50, height - 65, 250, height - 65)
    
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 85, "Premium Fashion & Lifestyle")
    
    # Invoice number badge with rounded effect
    badge_x = width - 200
    badge_y = height - 70
    c.setFillColor(colors.Color(1, 1, 1, 0.25))
    c.roundRect(badge_x, badge_y, 150, 40, 10, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(badge_x + 15, badge_y + 22, "INVOICE")
    c.setFont("Helvetica", 10)
    c.drawString(badge_x + 15, badge_y + 10, f"#{order_data['order_id']}")
    
    # ======= CUSTOMER INFO CARD =======
    y = height - 150
    card_height = 90
    
    # Card with rounded corners and soft shadow
    c.setFillColor(light_gray)
    c.setStrokeColor(border_gray)
    c.setLineWidth(1)
    c.roundRect(40, y - card_height, 250, card_height, 12, fill=1, stroke=1)
    
    # Card content
    c.setFillColor(deep_black)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(55, y - 25, "BILL TO")
    print(order_data)
    print(order_data.keys())

    
    c.setFont("Helvetica-Bold", 13)
    c.drawString(55, y - 45, order_data["user_name"])
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.Color(0.3, 0.3, 0.3))
    c.drawString(55, y - 62, order_data["user_email"])
    
    # Date card
    date_card_x = width - 240
    c.setFillColor(light_gray)
    c.setStrokeColor(border_gray)
    c.roundRect(date_card_x, y - card_height, 200, card_height, 12, fill=1, stroke=1)
    
    c.setFillColor(deep_black)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(date_card_x + 15, y - 25, "INVOICE DATE")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.Color(0.3, 0.3, 0.3))
    c.drawString(date_card_x + 15, y - 45, datetime.now().strftime('%B %d, %Y'))
    c.drawString(date_card_x + 15, y - 62, datetime.now().strftime('%I:%M %p'))
    
    # ======= TABLE SECTION =======
    y -= 130
    
    # Table header with violet gradient effect
    table_x = 40
    table_width = width - 80
    header_h = 35
    
    c.setFillColor(violet)
    c.roundRect(table_x, y - header_h, table_width, header_h, 8, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(table_x + 20, y - 20, "PRODUCT")
    c.drawString(table_x + 260, y - 20, "QTY")
    c.drawString(table_x + 350, y - 20, "PRICE")
    c.drawString(table_x + 450, y - 20, "TOTAL")
    
    # ======= TABLE ROWS =======
    y -= 50
    total = 0
    row_height = 35
    
    for i, item in enumerate(order_data["items"]):
        # Alternating row colors with subtle difference
        bg_color = colors.Color(0.98, 0.98, 0.99) if i % 2 == 0 else colors.white
        
        c.setFillColor(bg_color)
        c.rect(table_x, y - row_height + 8, table_width, row_height, fill=1, stroke=0)
        
        # Border between rows
        c.setStrokeColor(colors.Color(0.92, 0.92, 0.94))
        c.setLineWidth(0.5)
        c.line(table_x, y - row_height + 8, table_x + table_width, y - row_height + 8)
        
        c.setFillColor(deep_black)
        c.setFont("Helvetica", 11)
        c.drawString(table_x + 20, y - 10, item["name"])
        
        c.setFont("Helvetica-Bold", 11)
        c.drawString(table_x + 270, y - 10, str(item["quantity"]))
        
        c.setFont("Helvetica", 11)
        c.drawString(table_x + 350, y - 10, f"₹{item['price']:,.2f}")
        
        line_total = item["price"] * item["quantity"]
        c.setFont("Helvetica-Bold", 11)
        c.drawString(table_x + 450, y - 10, f"₹{line_total:,.2f}")
        
        total += line_total
        y -= row_height
    
    # ======= TOTAL SECTION =======
    y -= 30
    total_box_x = table_x + table_width - 260
    total_box_w = 260
    total_box_h = 50
    
    # Gradient effect for total box
    for i in range(int(total_box_h)):
        ratio = i / total_box_h
        r = 0.545 + (0.176 - 0.545) * ratio * 0.5
        g = 0.361 + (0.043 - 0.361) * ratio * 0.5
        b = 0.965 + (0.369 - 0.965) * ratio * 0.5
        c.setFillColorRGB(r, g, b)
        c.rect(total_box_x, y - i, total_box_w, 1, fill=1, stroke=0)
    
    # Round the corners visually
    c.setFillColor(colors.white)
    corner_size = 12
    c.rect(total_box_x, y - total_box_h, corner_size, corner_size, fill=1, stroke=0)
    c.rect(total_box_x + total_box_w - corner_size, y - total_box_h, corner_size, corner_size, fill=1, stroke=0)
    c.rect(total_box_x, y, corner_size, corner_size, fill=1, stroke=0)
    c.rect(total_box_x + total_box_w - corner_size, y, corner_size, corner_size, fill=1, stroke=0)
    
    # Redraw rounded rect properly
    c.setFillColor(violet)
    c.roundRect(total_box_x, y - total_box_h, total_box_w, total_box_h, 12, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(total_box_x + 20, y - 28, f"GRAND TOTAL: ₹{total:,.2f}")
    
    # ======= FOOTER SECTION =======
    footer_y = 80
    
    # Decorative line
    c.setStrokeColor(violet)
    c.setLineWidth(2)
    c.line(50, footer_y + 20, width - 50, footer_y + 20)
    
    # Footer text
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.Color(0.4, 0.4, 0.4))
    c.drawString(50, footer_y, "Thank you for shopping with Trendz Shop!")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(violet)
    c.drawString(50, footer_y - 18, "📧 support@trendzshop.com")
    c.drawString(50, footer_y - 33, "🌐 www.trendzshop.com")
    
    # Watermark
    c.setFont("Helvetica-Bold", 60)
    c.setFillColor(colors.Color(0.95, 0.95, 0.97, 0.3))
    c.saveState()
    c.translate(width/2, height/2)
    c.rotate(45)
    c.drawCentredString(0, 0, "PAID")
    c.restoreState()
    
    c.showPage()
    c.save()
    
    return invoice_path