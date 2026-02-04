from rest_framework import serializers
from .models import DeliveryOptions
import time

class DeliveryOptionSerializer(serializers.ModelSerializer):
    priceCents = serializers.IntegerField(source='price_cents')
    estimatedDeliveryTimeMs = serializers.SerializerMethodField()
    
    class Meta:
        model = DeliveryOptions
        fields = ['id', 'name', 'description', 'priceCents', 'estimatedDeliveryTimeMs']
    
    def get_estimatedDeliveryTimeMs(self, obj):
        """Calculate delivery timestamp in milliseconds"""
        import datetime
        from django.utils.timezone import now
        delivery_date = now() + datetime.timedelta(days=obj.delivery_days)
        return int(delivery_date.timestamp() * 1000)