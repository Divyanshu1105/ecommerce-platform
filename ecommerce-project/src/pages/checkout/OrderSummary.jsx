import { CartItemDetails } from './CartItemDetails';
import { DeliveryOptions } from './DeliveryOptions';
import { DeliveryDate } from './DeliveryDate';

export function OrderSummary({ cart, deliveryOptions }) {
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
                            <CartItemDetails cartItem={cartItem} />
                            <DeliveryOptions
                                cartItem={cartItem}
                                deliveryOptions={deliveryOptions}
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
}
