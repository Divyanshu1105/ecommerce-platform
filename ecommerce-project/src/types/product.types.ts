export interface ProductRating {
    stars: number;
    count: number;
}

export interface Product {
    id: number;
    image: string;
    name: string;
    rating: ProductRating;
    priceCents: number;
    keywords: string[];
}

export interface CreateProductDTO {
    image: string;
    name: string;
    rating_stars?: number;
    rating_count?: number;
    price_cents: number;
    keywords: string[];
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    status?: number;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export interface BackendProductData {
    image: string;
    name: string;
    price_cents: number;
    keywords: string[];
    rating_stars?: number;
    rating_count?: number;
}