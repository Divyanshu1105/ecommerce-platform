from rest_framework import viewsets
from .models import DeliveryOptions
from .serializers import DeliveryOptionSerializer

class DeliveryOptionViewSet(viewsets.ModelViewSet):
    queryset = DeliveryOptions.objects.all()
    serializer_class = DeliveryOptionSerializer
