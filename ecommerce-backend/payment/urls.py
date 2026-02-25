from django.urls import path
from . import views

urlpatterns = [
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('confirm-order/', views.confirm_order, name='confirm-order'),
    path('webhook/', views.stripe_webhook, name='stripe-webhook'),
]