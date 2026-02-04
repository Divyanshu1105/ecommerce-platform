from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price_cents']
        read_only_fields = ['id', 'product', 'price_cents']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    orderTimeMs = serializers.SerializerMethodField()
    totalCostCents = serializers.IntegerField(source='total_cost_cents')
    
    class Meta:
        model = Order
        fields = ['id', 'created_at', 'orderTimeMs', 'totalCostCents', 'items']
        read_only_fields = ['id', 'created_at', 'total_cost_cents', 'items']
    
    def get_orderTimeMs(self, obj):
        """Convert created_at to milliseconds timestamp"""
        return int(obj.created_at.timestamp() * 1000)