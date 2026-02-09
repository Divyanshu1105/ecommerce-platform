from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from products.models import Product
import uuid

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.all()
        # Expand products if requested
        expand = self.request.query_params.get('expand', '')
        if 'products' in expand:
            queryset = queryset.prefetch_related('items__product') 
        return queryset
    
    def list(self, request):
        """GET /api/orders/"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """POST /api/orders/ - Create order from cart"""
        try:
            # Get cart items
            cart_items = CartItem.objects.select_related('product').all()
            
            if not cart_items.exists():
                return Response(
                    {"error": "Cart is empty"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate total
            total_cost_cents = 0
            for item in cart_items:
                if item.product:
                    total_cost_cents += item.product.price_cents * item.quantity
            
            # Create order
            order = Order.objects.create(total_cost_cents=total_cost_cents)
            
            # Create order items
            order_items = []
            for item in cart_items:
                if item.product:
                    order_item = OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price_cents=item.product.price_cents
                    )
                    order_items.append(order_item)
            
            # Clear cart
            cart_items.delete()
            
            # Return created order
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )