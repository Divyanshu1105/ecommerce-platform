from django.core.management.base import BaseCommand
from orders.models import Order
from cart.models import CartItem

class Command(BaseCommand):
    help = 'Clear all orders and cart items'

    def handle(self, *args, **options):
        # Delete all orders
        orders_count = Order.objects.count()
        Order.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {orders_count} orders'))

        # Delete all cart items
        cart_count = CartItem.objects.count()
        CartItem.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {cart_count} cart items'))