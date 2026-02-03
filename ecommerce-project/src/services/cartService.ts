import apiService from './api';
import type { Product } from '../types/product.types';

export interface CartItem {
    id: number;
    product: Product;
    product_id: number;
    quantity: number;
    added_at: string;
    total_price_cents?: number;
}

export interface AddToCartDTO {
    product_id: number;
    quantity?: number;
}

class CartService {
    private basePath = '/cart-items/';  // Note: trailing slash

    // Add item to cart
    async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
        try {
            const data: AddToCartDTO = {
                product_id: productId,
                quantity
            };
            // Using basePath with trailing slash
            return await apiService.post<CartItem>(this.basePath, data);
        } catch (error) {
            console.error(`Error adding product ${productId} to cart:`, error);
            throw error;
        }
    }

    // Get all cart items
    async getCartItems(expandProduct: boolean = true): Promise<CartItem[]> {
        try {
            const url = expandProduct ? `${this.basePath}?expand=product` : this.basePath;
            return await apiService.get<CartItem[]>(url);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }

    // Other methods remain the same...
}

export const cartService = new CartService();
export default cartService;