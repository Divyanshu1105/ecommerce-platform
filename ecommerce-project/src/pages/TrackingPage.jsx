import axios from '../api/axiosConfig';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { PageMeta } from '../components/PageMeta';
import './TrackingPage.css';

export function TrackingPage({ cart }) {
    const { orderId, productId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/orders/${orderId}?expand=products`);
                setOrder(response.data);
            } catch {
                setError('Unable to load tracking information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, [orderId]);

    if (loading) {
        return (
            <>
                <PageMeta title="Order Tracking - Ecommerce Store" favicon="tracking-favicon.png" />
                <Header cart={cart} />
                <div className="tracking-page">
                    <div className="loading">Loading tracking information...</div>
                </div>
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <PageMeta title="Order Tracking - Ecommerce Store" favicon="tracking-favicon.png" />
                <Header cart={cart} />
                <div className="tracking-page">
                    <div className="error">
                        {error || 'Order not found'}
                        <Link className="back-to-orders-link link-primary" to="/orders">
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const orderItem = order.items?.find((item) => item.product.id === productId);

    if (!orderItem) {
        return (
            <>
                <PageMeta title="Order Tracking - Ecommerce Store" favicon="tracking-favicon.png" />
                <Header cart={cart} />
                <div className="tracking-page">
                    <div className="error">
                        Product not found in this order
                        <Link className="back-to-orders-link link-primary" to="/orders">
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const orderTimeMs = order.orderTimeMs;
    const estimatedDeliveryTimeMs = orderTimeMs + (7 * 24 * 60 * 60 * 1000);
    const totalDeliveryTimeMs = estimatedDeliveryTimeMs - orderTimeMs;
    const timePassedMs = dayjs().valueOf() - orderTimeMs;
    const deliveryPercent = Math.min((timePassedMs / totalDeliveryTimeMs) * 100, 100);

    const isPreparing = deliveryPercent < 33;
    const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
    const isDelivered = deliveryPercent === 100;

    return (
        <>
            <PageMeta title="Order Tracking - Ecommerce Store" favicon="tracking-favicon.png" />
            <Header cart={cart} />
            <div className="tracking-page">
                <div className="order-tracking">
                    <Link className="back-to-orders-link link-primary" to="/orders">
                        View all orders
                    </Link>

                    <div className="delivery-date">
                        {deliveryPercent >= 100 ? 'Delivered on ' : 'Arriving on '}
                        {dayjs(estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                    </div>

                    <div className="product-info">
                        {orderItem.product.name}
                    </div>

                    <div className="product-info">
                        Quantity: {orderItem.quantity}
                    </div>

                    <img className="product-image" src={orderItem.product.image} alt={orderItem.product.name} />

                    <div className="progress-labels-container">
                        <div className={`progress-label ${isPreparing && 'current-status'}`}>
                            Preparing
                        </div>
                        <div className={`progress-label ${isShipped && 'current-status'}`}>
                            Shipped
                        </div>
                        <div className={`progress-label ${isDelivered && 'current-status'}`}>
                            Delivered
                        </div>
                    </div>

                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${deliveryPercent}%` }}></div>
                    </div>
                </div>
            </div>
        </>
    );
}