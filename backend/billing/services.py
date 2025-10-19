from django.template import Template, Context
from weasyprint import HTML, CSS
from django.core.mail import EmailMessage

def render_invoice_pdf(ctx: dict) -> bytes:
    html = Template(ctx["template_html"]).render(Context(ctx))
    css = CSS(string=ctx.get("template_css",""))
    pdf_bytes = HTML(string=html).write_pdf(stylesheets=[css])
    return pdf_bytes

def send_invoice_email(subject: str, body: str, to_email: str, pdf_bytes: bytes, filename: str):
    msg = EmailMessage(subject, body, to=[to_email])
    msg.attach(filename=filename, content=pdf_bytes, mimetype="application/pdf")
    msg.send(fail_silently=False)
