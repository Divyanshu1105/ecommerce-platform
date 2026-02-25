from django.urls import path
from . import views

urlpatterns = [
    path('api/create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('api/confirm-order/', views.confirm_order, name='confirm-order'),
    path('api/stripe-webhook/', views.stripe_webhook, name='stripe-webhook'),
]