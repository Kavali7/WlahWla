def request_org(request):
    org = getattr(request, "organization", None)
    if not org:
        # In dev, you may default to the first org
        from .models import Organization
        org = Organization.objects.first()
    return org
