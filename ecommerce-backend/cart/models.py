from django.db import models
from products.models import Product
from delivery.models import DeliveryOptions

class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    delivery_option = models.ForeignKey(  # Add this field
        DeliveryOptions, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='cart_items'
    )
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    @property
    def total_price_cents(self):
        return self.quantity * self.product.price_cents
