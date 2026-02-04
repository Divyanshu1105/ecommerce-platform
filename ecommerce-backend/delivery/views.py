from rest_framework import viewsets
from .models import DeliveryOption
from .serializers import DeliveryOptionSerializer

class DeliveryOptionViewSet(viewsets.ModelViewSet):
    queryset = DeliveryOption.objects.all()
    serializer_class = DeliveryOptionSerializer
