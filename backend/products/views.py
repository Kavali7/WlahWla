from rest_framework import viewsets, permissions
from core.utils import request_org
from .models import Product, Tax, UnitOfMeasure
from .serializers import ProductSerializer, TaxSerializer, UnitSerializer

class OrgScopedViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        org = request_org(self.request)
        return super().get_queryset().filter(organization=org)
    def perform_create(self, serializer):
        serializer.save(organization=request_org(self.request))

class ProductViewSet(OrgScopedViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["is_active"]
    search_fields = ["sku","name","description"]
    ordering_fields = ["name","unit_price"]

class TaxViewSet(OrgScopedViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    permission_classes = [permissions.IsAuthenticated]

class UnitViewSet(OrgScopedViewSet):
    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]
