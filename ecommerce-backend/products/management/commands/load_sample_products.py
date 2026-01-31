# your_app/management/commands/load_sample_products.py
import json
from django.core.management.base import BaseCommand
from products.models import Product  # Replace 'your_app' with your app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Load sample products data'

    def handle(self, *args, **options):
        sample_products = [
            {
        "id": "59f7608a-2d71-4805-973c-6d00ae25b742",
        "image": "images/products/women-straight-leg-jeans-black.jpg",
        "name": "Women's Straight Leg Jeans - Black changed",
        "rating_stars": Decimal("4.5"),
        "rating_count": 127,
        "price_cents": 4500,
        "keywords": ["pants", "jeans", "women", "clothing"]
    },
    {
        "id": "2b02566e-cb4a-469c-bf93-d9cef4af7380",
        "image": "images/products/athletic-skateboard-shoes-gray.jpg",
        "name": "Athletic Skateboard Shoes - Gray",
        "rating_stars": Decimal("4.0"),
        "rating_count": 89,
        "price_cents": 3390,
        "keywords": ["shoes", "running shoes", "footwear"]
    },
    {
        "id": "aa7fa4af-fefe-4c21-8421-ee0435ca597a",
        "image": "images/products/men-cozy-fleece-hoodie-light-teal.jpg",
        "name": "Men's Fleece Hoodie - Light Teal",
        "rating_stars": Decimal("4.5"),
        "rating_count": 3157,
        "price_cents": 3800,
        "keywords": ["sweaters", "hoodies", "apparel", "mens"]
    },
    {
        "id": "b1a2c3d4-0000-4ddd-9eee-123456789010",
        "image": "images/products/desk-lamp-led.jpg",
        "name": "LED Desk Lamp changed",
        "rating_stars": Decimal("4.5"),
        "rating_count": 3157,
        "price_cents": 2300,
        "keywords": ["home", "lighting", "electronics"]
    },
    { "id": "d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a", "image": "images/products/wireless-bluetooth-earbuds.jpg", "name": "Wireless Bluetooth Earbuds", "rating_stars": Decimal("4.7"), "rating_count": 203, "price_cents": 5999, "keywords": ["electronics", "audio", "earbuds", "wireless"] }
        ]

        created_count = 0
        updated_count = 0

        for product_data in sample_products:
            product_id = product_data.pop('id')
            product, created = Product.objects.update_or_create(
                id=product_id,
                defaults=product_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {product.name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'Updated: {product.name}'))

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully loaded {created_count + updated_count} products '
                f'({created_count} created, {updated_count} updated)'
            )
        )