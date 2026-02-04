import { CartItemDetails } from './CartItemDetails';
import { DeliveryOptions } from './DeliveryOptions';
import { DeliveryDate } from './DeliveryDate';

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
    return (
        <div className="order-summary">
            {cart.length > 0 ? (
                cart.map((cartItem) => (
                    <div key={cartItem.id}>
                        {deliveryOptions.length > 0 && (
                            <DeliveryDate
                                cartItem={cartItem}
                                deliveryOptions={deliveryOptions}
                            />
                        )}

                        <div className="cart-item-details-grid">
                            <CartItemDetails cartItem={cartItem} loadCart={loadCart} />

                            {deliveryOptions.length > 0 && (
                                <DeliveryOptions
                                    cartItem={cartItem}
                                    deliveryOptions={deliveryOptions}
                                    loadCart={loadCart}
                                />
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-cart">Your cart is empty</div>
            )}
        </div>
    );
}