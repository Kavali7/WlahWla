from django.contrib import admin
from .models import Organization, Membership
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "country_code", "currency", "tax_enabled", "default_tax_rate", "org_code")
@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("organization", "user", "role", "is_active")
