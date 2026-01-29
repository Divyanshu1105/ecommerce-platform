import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class Product(models.Model):
    #UUID as primary key (matching your JSON 'id')
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    # Image field - store relatice path 
    image = models.CharField(
        max_length=500,
        help_text="Relative path to product image"
    )

    name=models.CharField(max_length=200)

    # Rating stars
    rating_stars = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0.0
    )

    # Rating count
    rating_count = models.PositiveIntegerField(default=0)

    #Price in cents(For exact currency calculation)
    price_cents = models.PositiveIntegerField(
        help_text="Price in cents (e.g., 3800 = $38.00)"
    )

    # Keywords as JSON field (array of strings)
    keywords = models.JSONField(
        default=list,
        help_text="List of keywords/tags for the product"
    )

    #Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
    
    # Helper property to get price in dollars
    @property
    def price_dollars(self):
        return self.price_cents / 100
    
    # Helper method to update rating
    def update_rating(self, new_stars):
        total_rating = (self.rating_stars * self.rating_count) + new_stars
        self.rating_count += 1
        self.rating_stars = total_rating / self.rating_count
        self.save()