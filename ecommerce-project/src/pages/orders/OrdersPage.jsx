import axios from '../../api/axiosConfig';
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { PageMeta } from '../../components/PageMeta';
import { OrdersGrid } from './OrdersGrid';
import './OrdersPage.css';

export function OrdersPage({ cart, loadCart }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrdersData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/orders?expand=products');
                setOrders(response.data);
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        getOrdersData();
    }, []);

    if (loading) {
        return (
            <>
                <PageMeta title="Your Orders - Ecommerce Store" favicon="orders-favicon.png" />
                <Header cart={cart} />
                <div className="orders-page">
                    <div className="page-title">Your Orders</div>
                    <div className="loading">Loading orders...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Your Orders - Ecommerce Store" favicon="orders-favicon.png" />
            <Header cart={cart} />
            <div className="orders-page">
                <div className="page-title">Your Orders</div>
                {orders.length === 0 ? (
                    <div className="no-orders">No orders yet</div>
                ) : (
                    <OrdersGrid orders={orders} loadCart={loadCart} />
                )}
            </div>
        </>
    );
}