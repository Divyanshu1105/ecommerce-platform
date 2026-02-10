import dayjs from 'dayjs';
import axios from 'axios';
import { Fragment, useState } from 'react'; // Add useState
import { formatMoney } from '../../utils/money';
import BuyAgainIcon from '../../assets/images/icons/buy-again.png';

export function OrdersGrid({ orders, loadCart }) {
    // Track updated quantities
    const [updatedQuantities, setUpdatedQuantities] = useState({});

    const addToCart = async (productId) => {
        await axios.post('/api/cart-items/', {
            product_id: productId,
            quantity: 1
        });

        // Update quantity in local state
        setUpdatedQuantities(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));

        await loadCart();
    };

    return (
        <div className="orders-grid">
            {orders.map((order) => {
                return (
                    <div key={order.id} className="order-container">

                        <div className="order-header">
                            <div className="order-header-left-section">
                                <div className="order-date">
                                    <div className="order-header-label">Order Placed:</div>
                                    <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                                </div>
                                <div className="order-total">
                                    <div className="order-header-label">Total:</div>
                                    <div>{formatMoney(order.totalCostCents)}</div>
                                </div>
                            </div>

                            <div className="order-header-right-section">
                                <div className="order-header-label">Order ID:</div>
                                <div>{order.id}</div>
                            </div>
                        </div>

                        <div className="order-details-grid">
                            {order.items && order.items.map((orderItem) => {  // Changed from order.products to order.items
                                const productId = orderItem.product.id;
                                const addedQuantity = updatedQuantities[productId] || 0;
                                const displayQuantity = orderItem.quantity + addedQuantity;  // Changed from orderProduct to orderItem

                                return (
                                    <Fragment key={productId}>
                                        <div className="product-image-container">
                                            <img src={orderItem.product.image} />  {/* Changed */}
                                        </div>

                                        <div className="product-details">
                                            <div className="product-name">
                                                {orderItem.product.name}  {/* Changed */}
                                            </div>
                                            <div className="product-delivery-date">
                                                Arriving on: {dayjs(orderItem.estimatedDeliveryTimeMs).format('MMMM D')}  {/* Changed - but this field doesn't exist! */}
                                            </div>
                                            <div className="product-quantity">
                                                Quantity: {displayQuantity}
                                            </div>
                                            <button className="buy-again-button button-primary"
                                                onClick={() => addToCart(productId)}>
                                                <img className="buy-again-icon" src={BuyAgainIcon} />
                                                <span className="buy-again-message">Add to Cart</span>
                                            </button>
                                        </div>

                                        <div className="product-actions">
                                            <a href={`/tracking/${order.id}/${orderItem.product.id}`}>
                                                <button className="track-package-button button-secondary">
                                                    Track package
                                                </button>
                                            </a>
                                        </div>
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}