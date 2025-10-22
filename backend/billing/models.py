from django.db import models
from core.models import OrgScopedModel
from products.models import Product, Tax

class Customer(OrgScopedModel):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    tax_id = models.CharField(max_length=64, blank=True)  # NIF du client
    phone = models.CharField(max_length=32, blank=True)
    def __str__(self):
        return self.name

class Quote(OrgScopedModel):
    number = models.CharField(max_length=30)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    issue_date = models.DateField()
    valid_until = models.DateField(null=True, blank=True)
    currency = models.CharField(max_length=3, default="XOF")
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, default="DRAFT")  # DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED
    class Meta:
        unique_together = ("organization","number")

class QuoteLine(models.Model):
    quote = models.ForeignKey(Quote, related_name="lines", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax = models.ForeignKey(Tax, null=True, blank=True, on_delete=models.SET_NULL)

class Invoice(OrgScopedModel):
    number = models.CharField(max_length=30)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    issue_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    currency = models.CharField(max_length=3, default="XOF")
    quote = models.ForeignKey(Quote, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, default="DRAFT")  # DRAFT, SENT, PARTIALLY_PAID, PAID, CANCELLED
    class Meta:
        unique_together = ("organization","number")

class InvoiceLine(models.Model):
    invoice = models.ForeignKey(Invoice, related_name="lines", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax = models.ForeignKey(Tax, null=True, blank=True, on_delete=models.SET_NULL)

class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, related_name="payments", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=30, default="CASH")  # CASH, CARD, TRANSFER, MOBILE
    paid_at = models.DateTimeField(auto_now_add=True)

class DocumentTemplate(OrgScopedModel):
    KIND_CHOICES = [("INVOICE","INVOICE"),("QUOTE","QUOTE"),("EMAIL","EMAIL")]
    name = models.CharField(max_length=100)
    kind = models.CharField(max_length=20, choices=KIND_CHOICES)
    locale = models.CharField(max_length=10, default="fr")
    html = models.TextField()
    css = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)


class Order(OrgScopedModel):
    PENDING, CONFIRMED, CANCELLED = "PENDING", "CONFIRMED", "CANCELLED"
    STATUSES = [
        (PENDING, "PENDING"),
        (CONFIRMED, "CONFIRMED"),
        (CANCELLED, "CANCELLED"),
    ]
    customer_name = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=32, blank=True)
    customer_email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, choices=STATUSES, default=PENDING)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
