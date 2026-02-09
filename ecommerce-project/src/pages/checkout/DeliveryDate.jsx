import dayjs from 'dayjs';

export function DeliveryDate({ cartItem, deliveryOptions }) {
    // Find matching delivery option
    const selectedDeliveryOption = deliveryOptions?.find(
        (deliveryOption) => {
            // If cartItem has delivery_option object
            if (cartItem.delivery_option && cartItem.delivery_option.id === deliveryOption.id) {
                return true;
            }
            // If cartItem has delivery_option_id field
            if (cartItem.delivery_option_id && cartItem.delivery_option_id === deliveryOption.id) {
                return true;
            }
            return false;
        }
    );

    if (!selectedDeliveryOption?.estimatedDeliveryTimeMs) {
        return null;
    }
    return (
        <div className="delivery-date">
            Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
        </div>
    );
}