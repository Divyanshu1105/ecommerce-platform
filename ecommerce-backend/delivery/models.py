from django.db import models
import uuid

class DeliveryOptions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price_cents = models.ImageField(default=0)
    delivery_days = models.ImageField(default=7)


    def __str__(self):
        return self.name
