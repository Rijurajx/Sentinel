import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from PIL import Image, ImageDraw, ImageFont

output_dir = os.path.abspath("demo_test_materials")
os.makedirs(output_dir, exist_ok=True)

# 1. Generate Demo Invoice PDF
pdf_path = os.path.join(output_dir, "Urgent_Apex_Logistics_Invoice_INV-8891.pdf")
doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleStyle",
    parent=styles["Heading1"],
    fontSize=22,
    textColor=colors.HexColor("#111827"),
    spaceAfter=4,
)
meta_style = ParagraphStyle(
    "MetaStyle",
    parent=styles["Normal"],
    fontSize=9,
    textColor=colors.HexColor("#4B5563"),
)
alert_style = ParagraphStyle(
    "AlertStyle",
    parent=styles["Normal"],
    fontSize=10,
    textColor=colors.HexColor("#991B1B"),
    fontName="Helvetica-Bold",
)
body_bold = ParagraphStyle(
    "BodyBold",
    parent=styles["Normal"],
    fontSize=10,
    textColor=colors.HexColor("#1F2937"),
    fontName="Helvetica-Bold",
)

story = []

# Header
story.append(Paragraph("APEX LOGISTICS GLOBAL LTD", title_style))
story.append(Paragraph("International Freight Forwarding & Supply Chain Solutions", meta_style))
story.append(Paragraph("140 Ocean Gateway Blvd, Suite 800 • Singapore / Delaware", meta_style))
story.append(Spacer(1, 16))

# Invoice Meta Table
meta_data = [
    [Paragraph("<b>Invoice Number:</b> INV-8891", styles["Normal"]), Paragraph("<b>Date:</b> Today", styles["Normal"])],
    [Paragraph("<b>Bill To:</b> Sentinel Operations Corp", styles["Normal"]), Paragraph("<b>Due Date:</b> Immediate Wire Settlement", alert_style)],
    [Paragraph("<b>Target Entity:</b> Apex Logistics International", styles["Normal"]), Paragraph("<b>Total Due:</b> <font color='#111827' size='12'><b>$148,500.00 USD</b></font>", styles["Normal"])],
]
meta_table = Table(meta_data, colWidths=[270, 270])
meta_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F9FAFB")),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E5E7EB")),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
]))
story.append(meta_table)
story.append(Spacer(1, 16))

# Line Items Table
line_data = [
    ["Description", "Qty", "Unit Price", "Total Amount"],
    ["Q4 Strategic Freight Forwarding — Asia-Pac Corridor", "1", "$95,000.00", "$95,000.00"],
    ["Expedited Customs Clearance & Fuel Surcharge", "1", "$32,500.00", "$32,500.00"],
    ["Emergency Port Demurrage Guarantee Allocation", "1", "$21,000.00", "$21,000.00"],
    ["", "", "TOTAL DUE:", "$148,500.00 USD"],
]
line_table = Table(line_data, colWidths=[280, 50, 100, 110])
line_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1F2937")),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('BOTTOMPADDING', (0,0), (-1,0), 6),
    ('BACKGROUND', (0,1), (-1,-2), colors.white),
    ('GRID', (0,0), (-1,-2), 0.5, colors.HexColor("#E5E7EB")),
    ('FONTNAME', (2,-1), (-1,-1), 'Helvetica-Bold'),
    ('BACKGROUND', (2,-1), (-1,-1), colors.HexColor("#F3F4F6")),
]))
story.append(line_table)
story.append(Spacer(1, 20))

# FRAUDULENT DIVERSION PAYMENT INSTRUCTIONS (Red Alert Box)
alert_box_data = [
    [Paragraph("⚠️ MANDATORY PAYMENT COORDINATES UPDATE — IMMEDIATE WIRE ONLY", alert_style)],
    [Paragraph(
        "<b>CRITICAL NOTICE:</b> Due to an internal banking consolidation audit, our historical master account has been temporarily frozen. "
        "All remittance payments for invoice INV-8891 must be transferred to the following beneficiary account before 17:00 EST:<br/><br/>"
        "• <b>Beneficiary Name:</b> Apex Logistics Global Ltd (Mule)<br/>"
        "• <b>Account Number:</b> 998877665544<br/>"
        "• <b>IFSC / Routing Code:</b> FAKEX009999<br/>"
        "• <b>Bank Entity:</b> Offshore Settlement Clearing Unit<br/><br/>"
        "<i>Do not contact our AP department by telephone as team members are currently offsite. Direct all wire proof confirmations to billing@apex-logistlcs-intl.co</i>",
        styles["Normal"]
    )]
]
alert_table = Table(alert_box_data, colWidths=[540])
alert_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#DC2626")),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('RIGHTPADDING', (0,0), (-1,-1), 12),
]))
story.append(alert_table)

doc.build(story)
print("Generated PDF:", pdf_path)

# 2. Generate Screenshot Image (Dark-Mode Executive Impersonation Email)
img_width, img_height = 800, 480
img = Image.new("RGB", (img_width, img_height), color="#0e1319")
draw = ImageDraw.Draw(img)

# Window Top Bar
draw.rectangle([0, 0, img_width, 42], fill="#18212d")
draw.ellipse([16, 15, 26, 25], fill="#ef4444")
draw.ellipse([34, 15, 44, 25], fill="#f59e0b")
draw.ellipse([52, 15, 62, 25], fill="#10b981")
draw.text((80, 14), "Thunderbird Mail — Confidential Executive Thread", fill="#94a3b8")

# Email Headers
draw.rectangle([20, 60, img_width - 20, 160], fill="#141c26", outline="#273546", width=1)
draw.text((36, 72), "From:", fill="#64748b")
draw.text((90, 72), "Marcus Sterling (CFO) <m.sterling@sentinel-corp-ops.net>", fill="#f87171") # Spoofed domain!
draw.text((36, 96), "To:", fill="#64748b")
draw.text((90, 96), "Treasury Operations <treasury-disbursement@sentinel.org>", fill="#cbd5e1")
draw.text((36, 120), "Subject:", fill="#64748b")
draw.text((90, 120), "URGENT: Immediate $148,500 wire required before cutoff (Do Not Call)", fill="#f1f5f9")

# Badge in Header
draw.rectangle([img_width - 160, 72, img_width - 36, 94], fill="#450a0a", outline="#991b1b")
draw.text((img_width - 150, 76), "HIGH PRIORITY", fill="#f87171")

# Email Body
body_lines = [
    "Hi Team,",
    "",
    "I am currently in an all-day closed-door M&A acquisition meeting and cannot take incoming calls.",
    "Our strategic logistics partner Apex Logistics requires an emergency wire transfer of $148,500.00",
    "prior to the 17:00 EST clearing window to secure vital freight allocations.",
    "",
    "Their primary account is currently undergoing banking reconciliation, so execute the wire directly to:",
    "   • Beneficiary: Apex Logistics Global Ltd",
    "   • Account Number: 998877665544",
    "   • Bank Code / IFSC: FAKEX009999",
    "",
    "Do not delay this for standard telephone verification. Reply with the SWIFT wire receipt immediately.",
    "",
    "Marcus Sterling",
    "Chief Financial Officer | Sentinel Operations"
]

y_offset = 180
for line in body_lines:
    color = "#fca5a5" if "Account Number" in line or "FAKEX" in line or "148,500" in line else "#94a3b8" if line.startswith("   •") else "#cbd5e1"
    draw.text((36, y_offset), line, fill=color)
    y_offset += 18

png_path = os.path.join(output_dir, "Executive_Impersonation_Wire_Screenshot.png")
img.save(png_path)
print("Generated Screenshot:", png_path)
