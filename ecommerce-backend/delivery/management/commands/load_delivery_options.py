from django.core.management.base import BaseCommand
from delivery.models import DeliveryOptions

class Command(BaseCommand):
    help = 'Load default delivery options'

    def handle(self, *args, **options):
        # Clear existing options to avoid duplicates
        DeliveryOptions.objects.all().delete()
        
        delivery_options = [
            {
                'name': 'Basic Delivery',
                'description': 'Standard shipping (5-7 business days)',
                'price_cents': 0,
                'delivery_days': 7
            },
            {
                'name': 'Standard Delivery', 
                'description': 'Faster shipping (3-5 business days)',
                'price_cents': 500,  # $5.00
                'delivery_days': 5
            },
            {
                'name': 'Fast Delivery',
                'description': 'Express shipping (1-2 business days)',
                'price_cents': 700,  # $7.00
                'delivery_days': 2
            }
        ]
        
        for option_data in delivery_options:
            DeliveryOptions.objects.create(**option_data)
            self.stdout.write(self.style.SUCCESS(f'Created: {option_data["name"]}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nCreated {len(delivery_options)} delivery options'))