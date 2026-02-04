// ecommerce-project/src/pages/orders/OrdersPage.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import './OrdersPage.css'
import { OrdersGrid } from './OrdersGrid';

export function OrdersPage({ cart, loadCart }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrdersData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/orders?expand=products');
                setOrders(response.data);
            } catch (error) {
                console.error('Error loading orders:', error);
                setOrders([]); // Empty array on error
            } finally {
                setLoading(false);
            }
        }

        getOrdersData();
    }, []);

    if (loading) {
        return (
            <>
                <title>Orders - Loading</title>
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
            <title>Orders</title>
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