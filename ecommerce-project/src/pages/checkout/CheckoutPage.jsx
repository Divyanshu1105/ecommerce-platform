import axios from '../../api/axiosConfig';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutHeader } from './CheckoutHeader';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import { PageMeta } from '../../components/PageMeta';
import './CheckoutPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function CheckoutPage({ cart, loadCart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            const deliveryResponse = await axios.get('/api/delivery-options/');
            const paymentResponse = await axios.get('/api/cart-items/payment_summary/');

            // ADD: Fetch clientSecret
            try {
                const intentResponse = await axios.post('/api/payment/create-payment-intent/', {}, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setClientSecret(intentResponse.data.clientSecret);
            } catch (error) {
                console.error('Failed to create PaymentIntent:', error);
            }

            setDeliveryOptions(deliveryResponse.data);
            setPaymentSummary(paymentResponse.data);
        };

        fetchCheckoutData();
    }, [cart]);

    if (!clientSecret) {
        return <div>Loading payment...</div>;
    }

    return (
        <>
            <PageMeta title="Checkout - Ecommerce Store" favicon="cart-favicon.png" />
            <CheckoutHeader cart={cart} />
            <div className="checkout-page">
                <div className="page-title">Review your order</div>
                <div className="checkout-grid">
                    <OrderSummary
                        deliveryOptions={deliveryOptions}
                        cart={cart}
                        loadCart={loadCart}
                    />
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentSummary
                            paymentSummary={paymentSummary}
                            loadCart={loadCart}
                        />
                    </Elements>
                </div>
            </div>
        </>
    );
}
