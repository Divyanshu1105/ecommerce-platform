import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import axios from '../api/axiosConfig';

// Use environment variable with fallback
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
                return config;
            },
            (error) => {
                console.error('[API Request Error]', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`[API Response] ${response.status} ${response.config.url}`);
                return response;
            },
            (error) => {
                console.error('[API Response Error]', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url,
                    baseURL: error.config?.baseURL,
                });

                // Custom error messages
                if (error.response?.status === 404) {
                    error.message = `Resource not found at ${error.config?.url}`;
                } else if (error.response?.status === 500) {
                    error.message = 'Django server error - check Django terminal';
                } else if (!error.response) {
                    error.message = `Network error - Check if Django is running at ${error.config?.baseURL}`;
                }

                return Promise.reject(error);
            }
        );
    }

    public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.get<T>(url, config)
            .then((response) => response.data);
    }

    public post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.post<T, AxiosResponse<T>, D>(url, data, config)
            .then((response) => response.data);
    }

    public put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.put<T, AxiosResponse<T>, D>(url, data, config)
            .then((response) => response.data);
    }

    public patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.patch<T, AxiosResponse<T>, D>(url, data, config)
            .then((response) => response.data);
    }

    public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.delete<T>(url, config)
            .then((response) => response.data);
    }

    public get instance(): AxiosInstance {
        return this.axiosInstance;
    }
}

export const apiService = new ApiService();
export default apiService;