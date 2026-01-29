from django.contrib import admin
from .models import Product

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating_stars', 'rating_count', 'price_dollars', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name' , 'keywords')
    readonly_fields = ('id' , 'created_at' , 'updated_at')

    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'image', 'price_cents')
        }),
        ('Rating', {
            'fields': ('rating_stars', 'rating_count')
        }),
        ('Tags', {
            'fields': ('keywords',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Display price in dollars in the list view
    def price_dollars(self, obj):
        return f"${obj.price_dollars:.2f}"
    price_dollars.short_description = 'Price'