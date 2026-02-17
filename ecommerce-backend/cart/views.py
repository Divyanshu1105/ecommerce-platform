from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import CartItem
from .serializers import CartItemSerializer
from products.models import Product
from delivery.models import DeliveryOptions

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    
    def get_queryset(self):
        """Filter cart items by user"""
        if self.request.user.is_authenticated:
            return CartItem.objects.filter(user=self.request.user).select_related('product', 'delivery_option')
        # For anonymous users, return empty queryset
        # We'll handle anonymous cart in frontend with localStorage
        return CartItem.objects.none()
    
    def get_permissions(self):
        """Different permissions for different actions"""
        if self.action in ['list', 'create', 'update', 'destroy', 'payment_summary']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """Create cart item for authenticated user"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required to add items to cart"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            # Validate required fields
            if 'product_id' not in request.data:
                return Response(
                    {"error": "product_id is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if product exists
            product_id = request.data['product_id']
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product with id {product_id} does not exist"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Handle delivery_option_id if present
            delivery_option = None
            if 'delivery_option_id' in request.data:
                delivery_option_id = request.data.get('delivery_option_id')
                if delivery_option_id:
                    try:
                        delivery_option = DeliveryOptions.objects.get(id=delivery_option_id)
                    except DeliveryOptions.DoesNotExist:
                        return Response(
                            {"error": f"Delivery option with id {delivery_option_id} does not exist"},
                            status=status.HTTP_404_NOT_FOUND
                        )
            
            # Check if item already exists in user's cart
            cart_item = CartItem.objects.filter(user=request.user, product=product).first()
            if cart_item:
                # Update quantity if exists
                quantity = request.data.get('quantity', 1)
                cart_item.quantity += quantity
                
                # Update delivery option if provided
                if delivery_option:
                    cart_item.delivery_option = delivery_option
                
                cart_item.save()
                serializer = self.get_serializer(cart_item)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Create new cart item for user
                cart_item = CartItem.objects.create(
                    user=request.user,
                    product=product,
                    quantity=request.data.get('quantity', 1),
                    delivery_option=delivery_option
                )
                serializer = self.get_serializer(cart_item)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """Update cart item (user-specific)"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        instance = self.get_object()
        
        # Ensure user owns this cart item
        if instance.user != request.user:
            return Response(
                {"error": "You don't have permission to update this item"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Handle delivery_option_id if present
        if 'delivery_option_id' in request.data:
            delivery_option_id = request.data.get('delivery_option_id')
            if delivery_option_id:
                try:
                    delivery_option = DeliveryOptions.objects.get(id=delivery_option_id)
                    instance.delivery_option = delivery_option
                except DeliveryOptions.DoesNotExist:
                    return Response(
                        {"error": f"Delivery option with id {delivery_option_id} does not exist"},
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                instance.delivery_option = None
        
        # Handle quantity update
        if 'quantity' in request.data:
            instance.quantity = request.data['quantity']
        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Delete cart item (user-specific)"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        instance = self.get_object()
        
        # Ensure user owns this cart item
        if instance.user != request.user:
            return Response(
                {"error": "You don't have permission to delete this item"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def payment_summary(self, request):
        """GET /api/cart-items/payment_summary/ - User specific"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        cart_items = self.get_queryset()
        
        product_cost_cents = 0
        total_items = 0
        shipping_cost_cents = 0
        
        for item in cart_items:
            if hasattr(item, 'product') and item.product:
                product_cost_cents += item.product.price_cents * item.quantity
                total_items += item.quantity
                
            if item.delivery_option and hasattr(item.delivery_option, 'price_cents'):
                shipping_cost_cents += item.delivery_option.price_cents
        
        tax_cents = int(product_cost_cents * 0.10)
        total_cost_before_tax_cents = product_cost_cents + shipping_cost_cents
        total_cost_cents = total_cost_before_tax_cents + tax_cents
        
        return Response({
            'totalItems': total_items,
            'productCostCents': product_cost_cents,
            'shippingCostCents': shipping_cost_cents,
            'totalCostBeforeTaxCents': total_cost_before_tax_cents,
            'taxCents': tax_cents,
            'totalCostCents': total_cost_cents
        })