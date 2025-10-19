from django.contrib import admin
from .models import Customer, Quote, QuoteLine, Invoice, InvoiceLine, Payment, DocumentTemplate
admin.site.register(Customer)
admin.site.register(Quote)
admin.site.register(QuoteLine)
admin.site.register(Invoice)
admin.site.register(InvoiceLine)
admin.site.register(Payment)
admin.site.register(DocumentTemplate)
