from django.db import models
from django.contrib.auth.models import User
import uuid
from products.models import Product

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        User, 
        on_delete= models.CASCADE,
        related_name='orders',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    total_cost_cents = models.IntegerField(default=0)

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES,  
        default='pending'  
    )

    payment_intent_id = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )
    
    def __str__(self):
        return f"Order {self.id}"
    
    class Meta:
        ordering = ['-created_at']

    


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price_cents = models.IntegerField()  # Price at time of order
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    @property
    def total_price_cents(self):
        return self.quantity * self.price_cents