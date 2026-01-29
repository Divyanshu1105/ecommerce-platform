from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    # Format the data to match your frontend JSON exactly
    id = serializers.CharField(source='id')
    priceCents = serializers.IntegerField(source='price_cents')

    rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'image', 'name', 'rating', 'priceCents', 'keywords']

    def get_rating(self, obj):
        return {
            "stars": float(obj.rating_stars),
            "count": obj.rating_count
        }