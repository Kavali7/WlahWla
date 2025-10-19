from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone
from billing.models import Invoice, InvoiceLine
from products.models import Product
from django.db.models import Sum, F, Value as V
from django.db.models.functions import TruncMonth

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def overview_metrics(request):
    now = timezone.now()
    mtd_revenue = (InvoiceLine.objects.filter(invoice__issue_date__month=now.month)
                   .annotate(total=F("quantity")*F("unit_price"))
                   .aggregate(sum=Sum("total"))["sum"] or 0)
    unpaid_total = 0
    active_products = Product.objects.filter(is_active=True).count()
    low_stock_count = 0
    return Response({
        "mtd_revenue": float(mtd_revenue),
        "unpaid_total": float(unpaid_total),
        "active_products": active_products,
        "low_stock_count": low_stock_count
    })

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def sales_by_month(request):
    qs = (InvoiceLine.objects
          .annotate(month=TruncMonth("invoice__issue_date"))
          .values("month")
          .annotate(revenue=Sum(F("quantity")*F("unit_price")))
          .order_by("month"))
    data = [{"month": (row["month"].strftime("%Y-%m") if row["month"] else "N/A"), "revenue": float(row["revenue"] or 0)} for row in qs]
    return Response(data)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def top_products(request):
    qs = (InvoiceLine.objects
          .values("product__name")
          .annotate(revenue=Sum(F("quantity")*F("unit_price")))
          .order_by("-revenue")[:5])
    return Response([{"name": row["product__name"] or "N/A", "revenue": float(row["revenue"] or 0)} for row in qs])

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def invoice_status_split(request):
    qs = (Invoice.objects.values("status").annotate(count=Sum(V(1))).order_by())
    return Response([{"status": row["status"], "value": int(row["count"])} for row in qs])

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def low_stock(request):
    # placeholder; implement your own stock level logic
    return Response([])
