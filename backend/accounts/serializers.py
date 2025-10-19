from django.contrib.auth import get_user_model
from rest_framework import serializers
from core.models import Organization, Membership

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email","first_name","last_name","is_active"]

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id","name","org_code","country_code","currency","address","trade_register","tax_id","tax_enabled","default_tax_rate","whatsapp_number"]

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["id","organization","user","role","is_active"]
