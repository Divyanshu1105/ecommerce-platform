from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        """Filter orders by user"""
        if self.request.user.is_authenticated:
            queryset = Order.objects.filter(user=self.request.user)
            # Expand products if requested
            expand = self.request.query_params.get('expand', '')
            if 'products' in expand:
                queryset = queryset.prefetch_related('items__product')
            return queryset
        return Order.objects.none()
    
    def get_permissions(self):
        """Different permissions for different actions"""
        if self.action in ['list', 'create', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def list(self, request):
        """GET /api/orders/ - User's orders only"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """POST /api/orders/ - Create order from user's cart"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required to place orders"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            # Get user's cart items
            cart_items = CartItem.objects.filter(user=request.user).select_related('product')
            
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
            
            # Create order for user
            order = Order.objects.create(
                user=request.user,
                total_cost_cents=total_cost_cents
            )
            
            # Create order items
            for item in cart_items:
                if item.product:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price_cents=item.product.price_cents
                    )
            
            # Clear user's cart
            cart_items.delete()
            
            # Return created order
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def retrieve(self, request, pk=None):
        """GET /api/orders/<id>/ - Get specific order (user's own only)"""
        try:
            order = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )