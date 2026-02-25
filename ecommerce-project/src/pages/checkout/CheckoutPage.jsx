import axios from '../../api/axiosConfig';
import { useEffect, useState } from 'react';
import { CheckoutHeader } from './CheckoutHeader';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import { PageMeta } from '../../components/PageMeta';
import './CheckoutPage.css';

export function CheckoutPage({ cart, loadCart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            const deliveryResponse = await axios.get('/api/delivery-options/');
            setDeliveryOptions(deliveryResponse.data);

            const paymentResponse = await axios.get('/api/cart-items/payment_summary/');
            setPaymentSummary(paymentResponse.data);
        };

        fetchCheckoutData();
    }, [cart]);

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
                    <PaymentSummary
                        paymentSummary={paymentSummary}
                        loadCart={loadCart}
                    />
                </div>
            </div>
        </>
    );
}