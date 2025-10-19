from django.contrib import admin
from .models import Product, Tax, UnitOfMeasure
admin.site.register(Product)
admin.site.register(Tax)
admin.site.register(UnitOfMeasure)
