from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CartItem
from .serializers import CartItemSerializer
from products.models import Product

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_queryset(self):
        queryset = CartItem.objects.all()
        return queryset.select_related('product')
    
    def list(self, request):
        expand = request.query_params.get('expand', '')

        if 'product' in expand:
            queryset = self.get_queryset()
        else:
            queryset = CartItem.objects.all()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
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