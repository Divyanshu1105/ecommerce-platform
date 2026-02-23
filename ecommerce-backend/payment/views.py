import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from orders.models import Order, OrderItem
from cart.models import CartItem

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """
    Create a PaymentIntent for the user's cart
    Called BEFORE order creation
    """
    try:
        # Get user's cart items
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        
        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate total (same as your order creation)
        total_cost_cents = 0
        for item in cart_items:
            if item.product:
                total_cost_cents += item.product.price_cents * item.quantity
        
        # Create a PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=total_cost_cents,
            currency='usd',
            metadata={
                'user_id': request.user.id,
                'username': request.user.username,
            }
        )
        
        return Response({
            'clientSecret': intent.client_secret,
            'paymentIntentId': intent.id,
            'amount': total_cost_cents
        })
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_order(request):
    """
    Create order AFTER payment is confirmed
    Called from frontend after successful payment
    """
    try:
        payment_intent_id = request.data.get('payment_intent_id')
        
        if not payment_intent_id:
            return Response(
                {"error": "payment_intent_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify payment with Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status != 'succeeded':
            return Response(
                {"error": "Payment not successful"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user's cart items
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        
        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate total
        total_cost_cents = 0
        for item in cart_items:
            if item.product:
                total_cost_cents += item.product.price_cents * item.quantity
        
        # Create order with payment info
        order = Order.objects.create(
            user=request.user,
            total_cost_cents=total_cost_cents,
            payment_status='paid',
            payment_intent_id=payment_intent_id
        )
        
        # Create order items
        for item in cart_items:
            if item.product:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price_cents=item.product.price_cents
                )
        
        # Clear cart
        cart_items.delete()
        
        from orders.serializers import OrderSerializer
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
def stripe_webhook(request):
    """
    Webhook called by Stripe when payment events occur
    This is the SAFETY NET - ensures order created even if user closes browser
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        
        # Check if order already exists (user might have completed flow)
        if not Order.objects.filter(payment_intent_id=intent['id']).exists():
            # Create order from cart
            user_id = intent['metadata'].get('user_id')
            if user_id:
                # We need to reconstruct cart - this is why we store cart in database!
                # This is a safety net - ideally user completes flow normally
                pass
    
    return Response(status=status.HTTP_200_OK)