from rest_framework import viewsets, permissions
from core.utils import request_org
from .models import Supplier, StockMovement
from .serializers import SupplierSerializer, StockMovementSerializer

class OrgScopedViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        org = request_org(self.request)
        return super().get_queryset().filter(organization=org)
    def perform_create(self, serializer):
        serializer.save(organization=request_org(self.request))

class SupplierViewSet(OrgScopedViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

class StockMovementViewSet(OrgScopedViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]
