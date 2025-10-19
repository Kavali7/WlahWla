from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from billing.views import InvoiceViewSet, CustomerViewSet, QuoteViewSet, PaymentViewSet, send_invoice_email_view, sync_view
from products.views import ProductViewSet, TaxViewSet, UnitViewSet
from inventory.views import SupplierViewSet, StockMovementViewSet
from accounts.views import UserViewSet, OrganizationViewSet, MembershipViewSet
from reports.views import overview_metrics, sales_by_month, top_products, invoice_status_split, low_stock

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'taxes', TaxViewSet, basename='tax')
router.register(r'units', UnitViewSet, basename='unit')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'stock-movements', StockMovementViewSet, basename='stockmovement')
router.register(r'users', UserViewSet, basename='user')
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'memberships', MembershipViewSet, basename='membership')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/reports/overview', overview_metrics),
    path('api/reports/sales_by_month', sales_by_month),
    path('api/reports/top_products', top_products),
    path('api/reports/invoice_status_split', invoice_status_split),
    path('api/reports/low_stock', low_stock),
    path('api/invoices/<int:pk>/send_email', send_invoice_email_view),
    path('api/sync', sync_view),  # offline queue landing endpoint
]
