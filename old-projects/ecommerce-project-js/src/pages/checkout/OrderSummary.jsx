import { CartItemDetails } from './CartItemDetails';
import { DeliveryOptions } from './DeliveryOptions';
import { DeliveryDate } from './DeliveryDate';

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
    return (
        <div className="order-summary">
            {deliveryOptions.length > 0 &&
                cart.map((cartItem) => (
                    <div key={cartItem.id}>
                        <DeliveryDate
                            cartItem={cartItem}
                            deliveryOptions={deliveryOptions}
                        />

                        <div className="cart-item-details-grid">
                            <CartItemDetails cartItem={cartItem} loadCart={loadCart} />
                            <DeliveryOptions
                                cartItem={cartItem}
                                deliveryOptions={deliveryOptions}
                                loadCart={loadCart}
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
}
