import { useState } from "react";
import axios from '../../api/axiosConfig';
import { useNavigate } from "react-router";
import { PaymentForm } from "../../components/PaymentForm";
import { formatMoney } from "../../utils/money";

export function PaymentSummary({ paymentSummary, loadCart }) {
    const navigate = useNavigate();
    const [showPayment, setShowPayment] = useState(false);

    if (!paymentSummary) return null;

    const handlePaymentSuccess = () => {
        // Cart is cleared, order created
        loadCart();
    };

    return (
        <div className="payment-summary">
            <div className="payment-summary-title">
                Payment Summary
            </div>

            <div className="payment-summary-row">
                <div>Items ({paymentSummary.totalItems}):</div>
                <div className="payment-summary-money">
                    {formatMoney(paymentSummary.productCostCents)}
                </div>
            </div>

            <div className="payment-summary-row">
                <div>Shipping & handling:</div>
                <div className="payment-summary-money">
                    {formatMoney(paymentSummary.shippingCostCents)}
                </div>
            </div>

            <div className="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div className="payment-summary-money">
                    {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
                </div>
            </div>

            <div className="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div className="payment-summary-money">
                    {formatMoney(paymentSummary.taxCents)}
                </div>
            </div>

            <div className="payment-summary-row total-row">
                <div>Order total:</div>
                <div className="payment-summary-money">
                    {formatMoney(paymentSummary.totalCostCents)}
                </div>
            </div>

            {!showPayment ? (
                <button
                    className="place-order-button button-primary"
                    onClick={() => setShowPayment(true)}
                >
                    Proceed to Payment
                </button>
            ) : (
                <PaymentForm
                    amount={paymentSummary.totalCostCents}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}