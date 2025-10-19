from django.db import models
from core.models import OrgScopedModel

class UnitOfMeasure(OrgScopedModel):
    code = models.CharField(max_length=16)   # ex: PCS, KG, L, M
    label = models.CharField(max_length=64)  # ex: Pièce, Kilogramme
    class Meta:
        unique_together = ("organization","code")
    def __str__(self):
        return f"{self.code} - {self.label}"

class Tax(OrgScopedModel):
    name = models.CharField(max_length=100)  # ex: TVA 18%
    rate = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    is_inclusive = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.name} ({self.rate}%)"

class Product(OrgScopedModel):
    sku = models.CharField(max_length=64)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="XOF")
    uom = models.ForeignKey(UnitOfMeasure, on_delete=models.SET_NULL, null=True, blank=True)
    tax = models.ForeignKey(Tax, on_delete=models.SET_NULL, null=True, blank=True)
    priority = models.PositiveSmallIntegerField(default=3)  # 1=haut, 5=bas
    is_active = models.BooleanField(default=True)
    class Meta:
        unique_together = ("organization","sku")
    def __str__(self):
        return self.name
