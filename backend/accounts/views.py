from typing import List, Dict, Any

from django.contrib.auth import (
    authenticate,
    get_user_model,
    login as django_login,
    logout as django_logout,
)
from rest_framework import viewsets, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.models import Organization, Membership
from .serializers import UserSerializer, OrganizationSerializer, MembershipSerializer

User = get_user_model()

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]


def _organization_missing_fields(organization: Organization) -> List[str]:
    missing: List[str] = []
    if not organization.address:
        missing.append("address")
    if not organization.tax_id:
        missing.append("tax_id")
    if not organization.trade_register:
        missing.append("trade_register")
    return missing


def _serialize_organization(organization: Organization) -> Dict[str, Any]:
    missing = _organization_missing_fields(organization)
    return {
        "id": str(organization.id),
        "name": organization.name,
        "code": organization.org_code,
        "org_code": organization.org_code,
        "country_code": organization.country_code,
        "currency": organization.currency,
        "address": organization.address,
        "trade_register": organization.trade_register,
        "tax_id": organization.tax_id,
        "tax_enabled": organization.tax_enabled,
        "default_tax_rate": float(organization.default_tax_rate),
        "whatsapp_number": organization.whatsapp_number,
        "brand_color": organization.brand_color,
        "logo_url": organization.logo_url,
        "is_onboarded": len(missing) == 0,
        "missing_fields": missing,
    }


def _serialize_user(user) -> Dict[str, Any]:
    memberships = (
        Membership.objects.select_related("organization")
        .filter(user=user, is_active=True)
        .order_by("organization__name")
    )
    organizations = [_serialize_organization(membership.organization) for membership in memberships]
    default_org_id = organizations[0]["id"] if organizations else None
    full_name = user.get_full_name().strip()
    return {
        "id": str(user.id),
        "email": user.email,
        "username": user.get_username(),
        "name": full_name or user.get_username(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_active": user.is_active,
        "organizations": organizations,
        "default_organization_id": default_org_id,
        "defaultOrganizationId": default_org_id,
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = str(request.data.get("email", "")).strip().lower()
    password = str(request.data.get("password", ""))

    if not email or not password:
        return Response(
            {"detail": "Adresse e-mail et mot de passe requis."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user_obj = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response(
            {"detail": "Identifiants invalides."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=user_obj.get_username(), password=password)
    if not user:
        return Response(
            {"detail": "Identifiants invalides."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user.is_active:
        return Response(
            {"detail": "Compte desactive."},
            status=status.HTTP_403_FORBIDDEN,
        )

    token, _ = Token.objects.get_or_create(user=user)
    django_login(request, user)

    return Response({"token": token.key, "user": _serialize_user(user)}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    auth_token = getattr(request, "auth", None)
    if isinstance(auth_token, Token):
        auth_token.delete()
    django_logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(_serialize_user(request.user), status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def password_forgot_view(request):
    # Implementation minimale: on masque l'existence du compte et on renvoie un succes.
    email = str(request.data.get("email", "")).strip()
    if not email:
        return Response({"detail": "Adresse e-mail requise."}, status=status.HTTP_400_BAD_REQUEST)
    # Dans un vrai environnement, envoyer un email de réinitialisation ici.
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_view(request):
    # Implementation simplifiee : un token "dev" permet la reinitialisation directe.
    token = str(request.data.get("token", "")).strip()
    password = str(request.data.get("password", ""))
    password_confirmation = str(request.data.get("password_confirmation", password))

    if not token or not password:
        return Response(
            {"detail": "Token et nouveau mot de passe requis."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if password != password_confirmation:
        return Response(
            {"detail": "Les mots de passe ne correspondent pas."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if token != "dev-reset":
        return Response(
            {"detail": "Token invalide dans cet environnement de demonstration."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = str(request.data.get("email", "")).strip()
    if not email:
        return Response(
            {"detail": "Adresse e-mail requise pour réinitialiser le mot de passe."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_204_NO_CONTENT)

    user.set_password(password)
    user.save(update_fields=["password"])
    return Response(status=status.HTTP_204_NO_CONTENT)
