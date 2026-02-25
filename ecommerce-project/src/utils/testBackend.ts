import axios from '../api/axiosConfig';
import { apiService } from '../services/api';
import type { Product } from '../types/product.types';

export interface BackendTestResult {
    directFetch: boolean;
    proxyFetch: boolean;
    axios: boolean;
    apiService: boolean;
    productsCount?: number;
    error?: string;
}

export const testBackendConnection = async (): Promise<BackendTestResult> => {
    console.log('🧪 Testing Django backend connection...');

    const result: BackendTestResult = {
        directFetch: false,
        proxyFetch: false,
        axios: false,
        apiService: false,
    };

    try {
        // Test 1: Direct fetch to Django
        try {
            const response1 = await fetch('http://localhost:8000/api/products/');
            console.log(`Test 1 - Direct fetch: ${response1.status} ${response1.statusText}`);
            result.directFetch = response1.ok;

            if (response1.ok) {
                const data = await response1.json();
                console.log(`Direct fetch products: ${Array.isArray(data) ? data.length : 'N/A'}`);
            }
        } catch (error) {
            console.error('Test 1 failed:', error);
        }

        // Test 2: Through proxy
        try {
            const response2 = await fetch('/api/products/');
            console.log(`Test 2 - Through proxy: ${response2.status} ${response2.statusText}`);
            result.proxyFetch = response2.ok;
        } catch (error) {
            console.error('Test 2 failed:', error);
        }

        // Test 3: Using axios directly
        try {
            axios.defaults.baseURL = 'http://localhost:8000';
            const response3 = await axios.get('/api/products/');
            console.log(`Test 3 - Using axios: ${response3.status} ${response3.statusText}`);
            result.axios = response3.status === 200;
        } catch (error) {
            console.error('Test 3 failed:', error);
        }

        // Test 4: Using apiService
        try {
            const response4 = await apiService.get<Product[]>('/products/');
            console.log(`Test 4 - Using apiService: Loaded ${response4.length} products`);
            result.apiService = Array.isArray(response4);
            result.productsCount = response4.length;
        } catch (error) {
            console.error('Test 4 failed:', error);
        }

    } catch (error) {
        console.error('❌ Backend test failed:', error);
        result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    console.log('📊 Test results:', result);
    return result;
};

// Helper function to run tests from browser console
export const runBackendTests = async () => {
    console.group('🔍 Django Backend Connection Tests');
    const results = await testBackendConnection();

    console.log('\n📋 Summary:');
    console.log(`Direct fetch to Django: ${results.directFetch ? '✅' : '❌'}`);
    console.log(`Through Vite proxy: ${results.proxyFetch ? '✅' : '❌'}`);
    console.log(`Using axios: ${results.axios ? '✅' : '❌'}`);
    console.log(`Using apiService: ${results.apiService ? '✅' : '❌'}`);

    if (results.productsCount !== undefined) {
        console.log(`Products loaded: ${results.productsCount}`);
    }

    if (results.error) {
        console.log(`Error: ${results.error}`);
    }

    console.groupEnd();

    return results;
};

