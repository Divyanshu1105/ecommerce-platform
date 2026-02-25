import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from '../api/axiosConfig';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { formatMoney } from '../utils/money';
import './PaymentForm.css';

interface PaymentFormProps {
    amount: number;
    onSuccess: () => void;
}

export function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {

            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
                redirect: 'if_required',
            });

            if (confirmError) {
                setPaymentError(confirmError.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                await axios.post('/api/payment/confirm-order/', {
                    payment_intent_id: paymentIntent.id
                });

                onSuccess();
                navigate('/orders');
            }

        } catch (error) {
            const axiosError = error as AxiosError<{ error: string }>;
            setPaymentError(axiosError.response?.data?.error || 'Payment processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <PaymentElement />

            {paymentError && (
                <div className="payment-error">
                    {paymentError}
                </div>
            )}

            <button
                type="submit"
                disabled={isProcessing || !stripe}
                className="payment-button"
            >
                {isProcessing ? 'Processing...' : `Pay ${formatMoney(amount)}`}
            </button>
        </form>
    );
}