"""Author venue-neutral replacement brochure pages, then rebuild the 12-page PDF.

This authors complete vector pages using ReportLab. It does not retouch or mask
text in the original raster images. All other supplied pages stay unchanged.
Run from any directory with Python, reportlab, Pillow and PyMuPDF installed.
"""
from pathlib import Path
import os
import subprocess
import sys
import tempfile

import fitz
from PIL import Image
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1]
BROCHURE = ROOT / "public" / "brochure"
W, H = 600, 600 * 1053 / 834
NAVY = colors.HexColor("#092656")
BLUE = colors.HexColor("#0758ed")
WHITE = colors.HexColor("#f6f7fa")
MUTED = colors.HexColor("#526880")
font_dir = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
if (font_dir / "arial.ttf").exists():
    pdfmetrics.registerFont(TTFont("Brochure", str(font_dir / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("BrochureBold", str(font_dir / "arialbd.ttf")))
else:
    pdfmetrics.registerFont(pdfmetrics.Font("Brochure", "Helvetica", "WinAnsiEncoding"))
    pdfmetrics.registerFont(pdfmetrics.Font("BrochureBold", "Helvetica-Bold", "WinAnsiEncoding"))
pdfmetrics.registerFontFamily("Brochure", normal="Brochure", bold="BrochureBold")


def line(c, text, x, y, size=12, bold=False, color=NAVY):
    c.setFillColor(color)
    c.setFont("BrochureBold" if bold else "Brochure", size)
    c.drawString(x, y, text)


def para(c, text, x, top, width=402, size=14, leading=21, color=NAVY, bold=False):
    style = ParagraphStyle("copy", fontName="BrochureBold" if bold else "Brochure", fontSize=size, leading=leading, textColor=color, spaceAfter=0)
    p = Paragraph(text, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top-height)
    return top-height


def gradient(c, x, y, width, height):
    # Vector strips produce a reliable blue/navy gradient in every PDF viewer.
    start, end = (8/255, 32/255, 74/255), (7/255, 91/255, 239/255)
    for i in range(180):
        p = i/179
        c.setFillColor(colors.Color(*(a+(b-a)*p for a,b in zip(start,end))))
        c.rect(x, y+height*(1-p)-height/180, width, height/180+1, stroke=0, fill=1)


def orbit(c, x, y, radius, alpha=.12):
    c.saveState()
    c.setStrokeColor(colors.white)
    c.setStrokeAlpha(alpha)
    c.setLineWidth(.8)
    c.circle(x, y, radius, stroke=1, fill=0)
    c.ellipse(x-radius*.5, y-radius, x+radius*.5, y+radius, stroke=1, fill=0)
    c.line(x-radius, y, x+radius, y)
    c.restoreState()


def base(c, printed, title):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    gradient(c, 0, 0, 94, H)
    orbit(c, 6, H*.57, 200, .15)
    c.setStrokeColor(colors.HexColor("#bfd0ed"))
    c.line(60, 42, 60, H-42)
    line(c, "HR VISTA 3.0 / 2026", 125, H-38, 8, True, MUTED)
    c.setFillColor(NAVY)
    c.rect(28, 49, 126, 126, stroke=0, fill=1)
    line(c, str(printed), 44, 66, 93, True, WHITE)
    lines = title.split("\n")
    for i, text in enumerate(lines):
        line(c, text, 174, 122-i*34, 32, True)
    line(c, f"HR VISTA 3.0  |  {printed:02}", 405, 28, 7, False, MUTED)


def cover(c):
    gradient(c, 0, 0, W, H)
    orbit(c, 422, 469, 290, .14)
    orbit(c, 452, 258, 210, .12)
    c.setStrokeColor(colors.HexColor("#cbdfff"))
    c.line(54, 240, 54, H-58)
    para(c, "PRESENTED BY THE CENTRE FOR PLACEMENT AND CAREER GUIDANCE<br/>CHRIST (DEEMED TO BE UNIVERSITY), PUNE LAVASA CAMPUS", 79, H-58, 457, 10, 14, WHITE, True)
    line(c, "HR", 71, 393, 157, True, WHITE)
    line(c, "3.0", 320, 401, 81, False, WHITE)
    line(c, "VISTA", 66, 257, 127, True, WHITE)
    c.setStrokeColor(colors.HexColor("#a3c4ff"))
    c.line(72, 227, 530, 227)
    line(c, "THE FUTURE OF WORK.", 75, 173, 24, True, WHITE)
    line(c, "THE PEOPLE WHO SHAPE IT.", 75, 142, 24, True, WHITE)
    line(c, "21-22 NOVEMBER 2026", 75, 92, 18, True, WHITE)
    line(c, "VENUE TO BE ANNOUNCED", 75, 63, 11, False, WHITE)


def glance(c):
    gradient(c, 0, 0, W, H)
    orbit(c, 386, 453, 270, .1)
    line(c, "THE NEXT EDITION / AT A GLANCE", 67, H-55, 9, True, WHITE)
    rows = [
        ("500+", "HR professionals and corporate leaders expected"),
        ("2 DAYS", "Of conversations, insights and networking"),
        ("50+", "Organisations and industry representation expected"),
        ("1 PLATFORM", "Connecting academia and industry"),
        ("VENUE TO BE ANNOUNCED", "Setting and location details will be shared once confirmed"),
        ("21-22 NOVEMBER 2026", "The next chapter of HR VISTA"),
    ]
    for i, (heading, body) in enumerate(rows):
        y = H-115-i*70
        c.setFillColor(colors.HexColor("#c3d9ff"))
        c.circle(47, y+4, 3, stroke=0, fill=1)
        line(c, heading, 67, y, 23 if len(heading)<24 else 18, True, WHITE)
        para(c, body, 68, y-10, 460, 12, 16, WHITE)
    line(c, "Participation figures are expectations and remain subject to confirmation.", 67, 177, 9, False, WHITE)
    c.setFillColor(NAVY)
    c.rect(28, 35, 126, 118, stroke=0, fill=1)
    line(c, "2", 53, 52, 96, True, WHITE)
    line(c, "HR VISTA 3.0", 177, 105, 34, True, WHITE)
    line(c, "AT A GLANCE", 177, 64, 34, True, WHITE)


def journey(c):
    base(c, 4, "THE HR VISTA\nJOURNEY")
    y = para(c, "FROM A CAMPUS INITIATIVE TO A CORPORATE HR PLATFORM", 125, H-75, 426, 22, 25, bold=True)
    paragraphs = [
        "HR VISTA was envisioned as a platform where emerging business leaders and the HR community could come together to understand the evolving world of people, organisations and work.",
        "HR VISTA 2.0 strengthened this vision through meaningful industry engagement, expert perspectives and conversations around the future of Human Resources.",
        "The third edition takes this vision forward.<br/><b>HR VISTA 3.0. Bigger. Broader. More connected.</b>",
        "HR VISTA 3.0 aims to bring together a diverse cross-section of India's HR ecosystem, from established enterprises and global organisations to emerging leaders and future-ready professionals.",
        "The focus is on understanding how organisations can build the people, cultures and leadership capabilities required for the future of HR.",
    ]
    for text in paragraphs:
        y = para(c, text, 125, y-22, 426, 13, 19)


def horizon(c):
    base(c, 8, "A SHARED\nHORIZON")
    y = para(c, "ROOTED IN LAVASA. OPEN TO WHAT COMES NEXT.", 125, H-75, 426, 22, 25, bold=True)
    y = para(c, "HR VISTA brings academia and industry into the same conversation. Its next chapter is built around the people, ideas and professional connections shaping the future of work.", 125, y-24, 426, 14, 21)
    blocks = [
        ("PEOPLE", "Students, educators, HR professionals and business leaders exchanging perspectives across experience and industry."),
        ("IDEAS", "Conversations about leadership, workplace culture, talent, technology and the changing world of work."),
        ("POSSIBILITIES", "Opportunities to learn from one another, build professional connections and explore shared questions."),
    ]
    for title, text in blocks:
        y -= 27
        line(c, title, 125, y, 14, True)
        y = para(c, text, 125, y-12, 426, 12, 18)
    y -= 29
    line(c, "VENUE TO BE ANNOUNCED", 125, y, 13, True)
    para(c, "The setting for HR VISTA 3.0 is still being finalised. Location details will be shared once confirmed.", 125, y-14, 426, 12, 18)


def finale(c):
    base(c, 11, "ONE SHARED\nFUTURE.")
    line(c, "TWO YEARS.", 174, 157, 32, True)
    y = H-110
    items = ["21-22 NOVEMBER 2026", "HR VISTA 3.0", "VENUE TO BE ANNOUNCED", "A gathering of people shaping organisations.", "A platform for ideas shaping workplaces.", "A conversation about the future of work."]
    for i, text in enumerate(items):
        c.setFillColor(BLUE)
        c.circle(112, y+5, 3.5, stroke=0, fill=1)
        bottom = para(c, text, 130, y+17, 405, 17 if i<3 else 16, 23, bold=i<3)
        y = bottom-32
    line(c, "THE FUTURE OF WORK. THE PEOPLE WHO SHAPE IT.", 125, 253, 10, True, MUTED)


def main():
    authors = {1: cover, 3: glance, 5: journey, 9: horizon, 12: finale}
    intermediates = ROOT / "tmp" / "pdfs"
    intermediates.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="hr-vista-brochure-", dir=intermediates) as temp:
        path = Path(temp) / "venue-neutral-pages.pdf"
        pdf = canvas.Canvas(str(path), pagesize=(W,H), pageCompression=1)
        pdf.setTitle("HR VISTA 3.0 - Venue-neutral replacement pages")
        pdf.setAuthor("CHRIST (Deemed to be University), Pune Lavasa Campus")
        for author in authors.values():
            author(pdf)
            pdf.showPage()
        pdf.save()
        document = fitz.open(path)
        for index, page_number in enumerate(authors):
            target = BROCHURE / f"page-{page_number:02}.png"
            with Image.open(target) as original:
                width, height = original.size
            page = document[index]
            # Keep existing raster dimensions so the reader has no layout shift.
            pixmap = page.get_pixmap(matrix=fitz.Matrix(width/W, height/H), alpha=False)
            assert pixmap.width == width and pixmap.height == height
            pixmap.save(target)
        text = " ".join(page.get_text() for page in document).lower()
        assert not any(term in text for term in ("mumbai", "bkc", "jio", "bandra"))
        document.close()
    subprocess.run([sys.executable, str(ROOT / "scripts/build-brochure.py")], check=True)
    with fitz.open(BROCHURE / "HR-VISTA-3.0.pdf") as final:
        assert len(final) == 12
    print("Updated pages 01, 03, 05, 09 and 12. Venue is explicitly unconfirmed.")


if __name__ == "__main__":
    main()
