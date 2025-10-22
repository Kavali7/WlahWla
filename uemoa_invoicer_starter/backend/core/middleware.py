from django.utils.deprecation import MiddlewareMixin
from .models import Organization

def get_org_from_request(request):
    # 1) header 'X-Org' -> org_code
    org_code = request.headers.get("X-Org")
    if org_code:
        try:
            return Organization.objects.get(org_code=org_code)
        except Organization.DoesNotExist:
            return None
    # 2) subdomain pattern: <org>.yourdomain.tld (placeholder)
    host = request.get_host().split(":")[0]
    parts = host.split(".")
    if len(parts) > 2:
        sub = parts[0]
        try:
            return Organization.objects.get(org_code=sub)
        except Organization.DoesNotExist:
            return None
    return None

class OrganizationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.organization = get_org_from_request(request)
