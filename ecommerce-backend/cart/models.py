from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from delivery.models import DeliveryOptions

class CartItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = 'cart_items',
        null = True, # Temporary for migrations
        blank = True,
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    delivery_option = models.ForeignKey( 
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
    
    class Meta:
        unique_together = ['user','product']
