import apiService from './api';
import type { Product, CreateProductDTO, UpdateProductDTO, BackendProductData } from '../types/product.types';

class ProductService {
    private basePath = '/products/';

    // Get all products
    async getAllProducts(): Promise<Product[]> {
        try {
            return await apiService.get<Product[]>(this.basePath);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Get single product by ID
    async getProductById(id: number): Promise<Product> {
        try {
            return await apiService.get<Product>(`${this.basePath}${id}/`);
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }

    // Create new product
    async createProduct(productData: CreateProductDTO): Promise<Product> {
        try {
            const backendData: BackendProductData = {
                image: productData.image,
                name: productData.name,
                price_cents: productData.price_cents,
                keywords: productData.keywords,
                ...(productData.rating_stars && { rating_stars: productData.rating_stars }),
                ...(productData.rating_count && { rating_count: productData.rating_count }),
            };
            return await apiService.post<Product>(this.basePath, backendData);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    // Update existing product
    async updateProduct(id: number, productData: UpdateProductDTO): Promise<Product> {
        try {
            // Build ONLY from provided data - no empty defaults
            const updates: Partial<BackendProductData> = {};

            if (productData.image !== undefined) updates.image = productData.image;
            if (productData.name !== undefined) updates.name = productData.name;
            if (productData.price_cents !== undefined) updates.price_cents = productData.price_cents;
            if (productData.keywords !== undefined) updates.keywords = productData.keywords;
            if (productData.rating_stars !== undefined) updates.rating_stars = productData.rating_stars;
            if (productData.rating_count !== undefined) updates.rating_count = productData.rating_count;

            // Type assertion - backend accepts partial updates
            return await apiService.put<Product>(`${this.basePath}${id}/`, updates as BackendProductData);
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    }

    // Delete product
    async deleteProduct(id: number): Promise<void> {
        try {
            await apiService.delete(`${this.basePath}${id}/`);
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    }

    // Search products by keyword
    async searchProducts(keyword: string): Promise<Product[]> {
        try {
            const allProducts = await this.getAllProducts();
            return allProducts.filter(product =>
                product.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );
        } catch (error) {
            console.error(`Error searching products with keyword "${keyword}":`, error);
            throw error;
        }
    }
}

export const productService = new ProductService();
export default productService;
