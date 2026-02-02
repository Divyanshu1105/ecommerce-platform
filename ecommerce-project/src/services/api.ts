import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/product.types'; // type-only import

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });
        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor (unchanged)
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                    data: config.data,
                    params: config.params,
                });
                return config;
            },
            (error) => {
                console.error('[API Request Error]', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor (unchanged)
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
                return response;
            },
            (error) => {
                console.error('[API Response Error]', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url,
                });

                if (error.response?.status === 404) {
                    error.message = 'Resource not found';
                } else if (error.response?.status === 401) {
                    error.message = 'Unauthorized access';
                } else if (error.response?.status === 500) {
                    error.message = 'Internal server error';
                } else if (!error.response) {
                    error.message = 'Network error - please check your connection';
                }

                return Promise.reject(error);
            }
        );
    }

    //  FIXED: Unwraps ApiResponse<T>.data + generics
    public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.get<ApiResponse<T>>(url, config)
            .then((response) => response.data.data); // Your ApiResponse structure
    }

    public post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.post<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data, config)
            .then((response) => response.data.data);
    }

    public put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.put<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data, config)
            .then((response) => response.data.data);
    }

    public patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.patch<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data, config)
            .then((response) => response.data.data);
    }

    public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.delete<ApiResponse<T>>(url, config)
            .then((response) => response.data.data);
    }

    public get instance(): AxiosInstance {
        return this.axiosInstance;
    }
}

export const apiService = new ApiService();
export default apiService;
