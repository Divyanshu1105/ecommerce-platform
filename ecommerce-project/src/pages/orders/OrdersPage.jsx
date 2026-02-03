import axios from 'axios';
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import './OrdersPage.css'
import { OrdersGrid } from './OrdersGrid';

export function OrdersPage({ cart, loadCart }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrdersData = async () => {
            try {
                // Try to get cart items instead of orders
                const response = await axios.get('/api/cart-items?expand=product');

                // Create a single order from cart items
                const orderFromCart = {
                    id: 'cart-' + Date.now(),
                    orderTimeMs: Date.now(),
                    totalCostCents: response.data.reduce((sum, item) =>
                        sum + (item.product?.priceCents || 0) * item.quantity, 0
                    ),
                    products: response.data.map(item => ({
                        product: item.product,
                        quantity: item.quantity,
                        estimatedDeliveryTimeMs: Date.now() + 604800000 // 7 days
                    }))
                };

                setOrders([orderFromCart]);
            } catch (error) {
                console.log('Showing empty cart (no items or error)');
                setOrders([]);
            }
        }

        getOrdersData();
    }, []);

    return (
        <>
            <title>Your Cart</title>
            <link rel="icon" type="image/svg+xml" href="orders-favicon.png" />
            <Header cart={cart} />

            <div className="orders-page">
                <div className="page-title">
                    {orders.length > 0 ? 'Your Cart Items' : 'Your Cart is Empty'}
                </div>

                <OrdersGrid orders={orders} loadCart={loadCart} />
            </div>
        </>
    );
}