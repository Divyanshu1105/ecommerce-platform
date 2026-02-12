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
            
            # Check if item already exists in cart
            cart_item = CartItem.objects.filter(product=product).first()
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
                # Create new cart item with delivery option
                cart_item_data = {
                    'product': product,
                    'quantity': request.data.get('quantity', 1)
                }
                if delivery_option:
                    cart_item_data['delivery_option'] = delivery_option
                
                cart_item = CartItem.objects.create(**cart_item_data)
                serializer = self.get_serializer(cart_item)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """Handle updating delivery option and quantity"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
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
                # If delivery_option_id is empty/null, remove the delivery option
                instance.delivery_option = None
        
        # Handle quantity update
        if 'quantity' in request.data:
            instance.quantity = request.data['quantity']
        
        # Save the instance
        instance.save()
        
        # Return the updated data
        serializer = self.get_serializer(instance)
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
        """GET /api/cart-items/payment_summary/"""
        cart_items = self.get_queryset()
        
        product_cost_cents = 0
        total_items = 0
        shipping_cost_cents = 0  # Initialize shipping cost
        
        for item in cart_items:
            if hasattr(item, 'product') and item.product:
                product_cost_cents += item.product.price_cents * item.quantity
                total_items += item.quantity
                
                # SAFELY add shipping cost if item has a delivery option
            if item.delivery_option and hasattr(item.delivery_option, 'price_cents'):
                shipping_cost_cents += item.delivery_option.price_cents
        
        # Calculate payment summary
        tax_cents = int(product_cost_cents * 0.10)  # 10% tax
        total_cost_before_tax_cents = product_cost_cents + shipping_cost_cents
        total_cost_cents = total_cost_before_tax_cents + tax_cents
        
        return Response({
            'totalItems': total_items,
            'productCostCents': product_cost_cents,
            'shippingCostCents': shipping_cost_cents,  # Now properly calculated
            'totalCostBeforeTaxCents': total_cost_before_tax_cents,
            'taxCents': tax_cents,
            'totalCostCents': total_cost_cents
        })