from django.db import models
from django.conf import settings

class Organization(models.Model):
    name = models.CharField(max_length=200)
    org_code = models.SlugField(unique=True)  # pour sous-domaine / routing
    country_code = models.CharField(max_length=2, default="BJ")
    currency = models.CharField(max_length=3, default="XOF")
    address = models.TextField(blank=True)
    trade_register = models.CharField(max_length=64, blank=True)  # RCCM/RC
    tax_id = models.CharField(max_length=64, blank=True)          # IFU / NIF
    tax_enabled = models.BooleanField(default=True)
    default_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18)  # %
    whatsapp_number = models.CharField(max_length=32, blank=True)  # pour Click-to-Chat
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Membership(models.Model):
    ROLE_CHOICES = [
        ("ADMIN","Admin"),
        ("ACCOUNTANT","Comptable"),
        ("SALES","Commercial"),
        ("WAREHOUSE","Logistique"),
        ("VIEWER","Lecture"),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="VIEWER")
    is_active = models.BooleanField(default=True)
    class Meta:
        unique_together = ("organization","user")

class OrgScopedModel(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    class Meta:
        abstract = True
