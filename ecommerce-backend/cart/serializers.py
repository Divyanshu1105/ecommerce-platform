from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer
from delivery.serializers import DeliveryOptionSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True, required=True)
    total_price_cents = serializers.IntegerField(read_only=True)
    delivery_option_id = serializers.UUIDField(
        source='delivery_option.id',
        read_only=True,
        allow_null=True,
        required=False
    )
    
    class Meta:
        model = CartItem
        fields = [
            'id', 
            'product', 
            'product_id', 
            'quantity', 
            'added_at', 
            'total_price_cents',
            'delivery_option_id',
            'delivery_option'  # Keep this if you want the full object
        ]
        read_only_fields = [
            'id', 
            'added_at', 
            'product', 
            'total_price_cents',
            'delivery_option_id',
            'delivery_option'
        ]

    def create(self, validated_data):
        validated_data.pop('product_id', None)
        return super().create(validated_data)