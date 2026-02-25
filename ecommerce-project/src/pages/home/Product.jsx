import axios from '../../api/axiosConfig';
import { useState } from "react";
import CheckmarkIcon from '../../assets/images/icons/checkmark.png';
import { formatMoney } from "../../utils/money";

export function Product({ product, loadCart }) {
    const [quantity, setQuantity] = useState(1);
    const [showAddedMessage, setShowAddedMessage] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const addToCart = async () => {
        try {
            setIsAdding(true);

            // FIX 1: Add trailing slash
            // FIX 2: Use product_id (with underscore) not productId
            await axios.post('/api/cart-items/', {
                product_id: product.id,  // Changed from productId to product_id
                quantity: quantity
            });

            await loadCart();

            setShowAddedMessage(true);

            setTimeout(() => {
                setShowAddedMessage(false);
            }, 2000);

        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert(`Failed to add ${product.name} to cart. Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsAdding(false);
        }
    };

    const selectQuantity = (event) => {
        const quantitySelected = Number(event.target.value);
        setQuantity(quantitySelected);
    }

    return (
        <div className="product-container"
            data-testid="product-container">
            <div className="product-image-container">
                <img className="product-image"
                    data-testid="product-image"
                    src={product.image}
                    alt={product.name} // Added alt attribute for accessibility
                />
            </div>

            <div className="product-name limit-text-to-2-lines">
                {product.name}
            </div>

            <div className="product-rating-container">
                <img className="product-rating-stars"
                    data-testid="product-rating-stars-image"
                    src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
                    alt={`Rating: ${product.rating.stars} stars`}
                />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <div className="product-price">
                {formatMoney(product.priceCents)}
            </div>

            <div className="product-quantity-container">
                <select
                    value={quantity}
                    onChange={selectQuantity}
                    data-testid="product-quantity-selector"
                    disabled={isAdding} // Disable while adding
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart" style={{
                opacity: showAddedMessage ? 1 : 0,
            }}>
                <img src={CheckmarkIcon} alt="Checkmark" />
                Added
            </div>

            <button
                className="add-to-cart-button button-primary"
                data-testid="add-to-cart-button"
                onClick={addToCart}
                disabled={isAdding} // Disable button while adding
            >
                {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
        </div>
    );
}