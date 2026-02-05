from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CartItem
from .serializers import CartItemSerializer
from products.models import Product
from delivery.models import DeliveryOptions

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_queryset(self):
        # Always select_related to avoid N+1 queries
        return CartItem.objects.select_related('product', 'delivery_option')
    
    def list(self, request):
        # SIMPLIFY THIS METHOD - remove the expand logic causing issues
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            # Log the error for debugging
            print(f"Error in cart list: {str(e)}")
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def create(self, request, *args, **kwargs):
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
            
            # Check if item already exists in cart
            cart_item = CartItem.objects.filter(product=product).first()
            if cart_item:
                # Update quantity if exists
                quantity = request.data.get('quantity', 1)
                cart_item.quantity += quantity
                cart_item.save()
                serializer = self.get_serializer(cart_item)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Create new cart item
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save(product=product)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
                
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """Handle updating delivery option"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle delivery_option_id update
        if 'delivery_option_id' in request.data:
            delivery_option_id = request.data['delivery_option_id']
            try:
                delivery_option = DeliveryOptions.objects.get(id=delivery_option_id)
                instance.delivery_option = delivery_option
                instance.save()
                
                # Remove from request.data so serializer doesn't try to process it
                request.data.pop('delivery_option_id', None)
            except DeliveryOptions.DoesNotExist:
                return Response(
                    {"error": f"Delivery option with id {delivery_option_id} does not exist"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    @action(detail=False, methods=['get'])
    def payment_summary(self, request):
        """GET /api/cart-items/payment-summary/"""
        cart_items = self.get_queryset()
        
        product_cost_cents = 0
        total_items = 0
        
        for item in cart_items:
            if hasattr(item, 'product') and item.product:
                product_cost_cents += item.product.price_cents * item.quantity
                total_items += item.quantity
        
        # Calculate payment summary
        shipping_cost_cents = 0  # Free shipping
        tax_cents = int(product_cost_cents * 0.10)  # 10% tax
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