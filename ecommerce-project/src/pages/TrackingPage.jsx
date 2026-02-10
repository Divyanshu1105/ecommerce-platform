import axios from 'axios';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import './TrackingPage.css'

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
                console.log('Order data:', response.data); // Debug log
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError(`Failed to load order: ${error.response?.data?.error || error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, [orderId]);

    if (loading) {
        return (
            <>
                <title>Tracking - Loading</title>
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
                <title>Tracking - Error</title>
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

    // Find the order item by product ID
    const orderItem = order.items?.find((item) => {
        return item.product.id === productId;
    });

    if (!orderItem) {
        return (
            <>
                <title>Tracking - Not Found</title>
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

    // Calculate delivery progress
    // Note: OrderItem doesn't have estimatedDeliveryTimeMs, so we need to calculate or get from delivery option
    const orderTimeMs = order.orderTimeMs;
    const estimatedDeliveryTimeMs = orderTimeMs + (7 * 24 * 60 * 60 * 1000); // Default 7 days delivery

    const totalDeliveryTimeMs = estimatedDeliveryTimeMs - orderTimeMs;
    const timePassedMs = dayjs().valueOf() - orderTimeMs;

    let deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
    if (deliveryPercent > 100) {
        deliveryPercent = 100;
    }

    const isPreparing = deliveryPercent < 33;
    const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
    const isDelivered = deliveryPercent === 100;

    return (
        <>
            <title>Tracking</title>
            <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />
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

                    <img className="product-image" src={orderItem.product.image} />

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
                        <div className="progress-bar"
                            style={{ width: `${deliveryPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
}