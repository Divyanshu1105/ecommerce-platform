from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price_cents = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'added_at', 'total_price_cents']

        read_only_fields = ['id', 'added_at', 'product', 'total_price_cents']

    def create(self, validated_data):
    # Remove product_id from validated_data as we'll handle it in view
        validated_data.pop('product_id', None)
        return super().create(validated_data)