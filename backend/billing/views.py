from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.utils import request_org
from compliance import adapter_for
from .models import Customer, Quote, Invoice, Payment, DocumentTemplate, Order
from .serializers import (
    CustomerSerializer,
    QuoteSerializer,
    InvoiceSerializer,
    PaymentSerializer,
    DocumentTemplateSerializer,
    OrderSerializer,
)
from .services import render_invoice_pdf, send_invoice_email

class OrgScopedViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        org = request_org(self.request)
        return super().get_queryset().filter(organization=org)
    def perform_create(self, serializer):
        serializer.save(organization=request_org(self.request))

class CustomerViewSet(OrgScopedViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["name","email","tax_id"]

class QuoteViewSet(OrgScopedViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

class InvoiceViewSet(OrgScopedViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        org = request_org(self.request)
        qs = Payment.objects.select_related("invoice", "invoice__organization")
        if org:
            qs = qs.filter(invoice__organization=org)
        return qs


class OrderViewSet(OrgScopedViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_invoice_email_view(request, pk:int):
    invoice = get_object_or_404(Invoice, pk=pk)
    org = invoice.organization
    tmpl = DocumentTemplate.objects.filter(organization=org, kind="INVOICE", is_default=True).first()
    if not tmpl:
        return Response({"detail":"Aucun template INVOICE par défaut."}, status=400)
    lines = []
    subtotal = 0.0
    for line in invoice.lines.select_related("tax"):
        line_total = float(line.unit_price) * float(line.quantity)
        subtotal += line_total
        lines.append(
            {
                "description": line.description,
                "quantity": float(line.quantity),
                "unit_price": float(line.unit_price),
                "tax": float(line.tax.rate) if line.tax else None,
                "total": round(line_total, 2),
            }
        )
    tax_rate = float(org.default_tax_rate) if org.tax_enabled else 0.0
    tax_total = round(subtotal * tax_rate / 100.0, 2)
    grand_total = round(subtotal + tax_total, 2)
    rules = adapter_for(org).rules()
    ctx = {
        "template_html": tmpl.html,
        "template_css": tmpl.css,
        "org": org,
        "invoice": invoice,
        "customer": invoice.customer,
        "lines": lines,
        "subtotal": round(subtotal, 2),
        "tax_total": tax_total,
        "grand_total": grand_total,
        "vat_label": rules.vat_label,
        "brand_color": getattr(org, "brand_color", "#111827"),
        "logo_url": getattr(org, "logo_url", ""),
    }
    pdf_bytes = render_invoice_pdf(ctx)
    to_email = (invoice.customer.email or "").strip() or request.data.get("to")
    if not to_email:
        return Response({"detail": "Aucune adresse e-mail fournie."}, status=400)
    send_invoice_email(
        f"Facture {invoice.number}",
        "Veuillez trouver votre facture en pièce jointe.",
        to_email,
        pdf_bytes,
        f"{invoice.number}.pdf",
    )
    return Response({"status": "sent"})

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def sync_view(request):
    # Receives a list of offline-queued mutations and applies them.
    # This is a minimal stub — implement idempotency and per-model handlers as needed.
    payload = request.data
    return Response({"received": payload, "status": "ok"})
