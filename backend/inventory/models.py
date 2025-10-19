from django.db import models
from core.models import OrgScopedModel
from products.models import Product

class Supplier(OrgScopedModel):
    name = models.CharField(max_length=200)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    def __str__(self):
        return self.name

class StockMovement(OrgScopedModel):
    IN, OUT, ADJUST = "IN","OUT","ADJUST"
    MOV_TYPES = [(IN,"IN"),(OUT,"OUT"),(ADJUST,"ADJUST")]
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    mov_type = models.CharField(max_length=10, choices=MOV_TYPES)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    ref = models.CharField(max_length=100, blank=True)
    occurred_at = models.DateTimeField(auto_now_add=True)
