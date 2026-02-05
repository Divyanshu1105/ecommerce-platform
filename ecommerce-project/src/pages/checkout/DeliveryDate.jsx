import dayjs from 'dayjs';

export function DeliveryDate({ cartItem, deliveryOptions }) {
    console.log('cartItem:', cartItem);
    console.log('deliveryOptions:', deliveryOptions);
    console.log('cartItem.delivery_option_id:', cartItem.delivery_option_id);
    const selectedDeliveryOption = deliveryOptions?.find(
        (deliveryOption) => deliveryOption.id === cartItem.delivery_option_id
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