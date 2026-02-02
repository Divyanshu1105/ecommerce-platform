// ecommerce-project/src/components/TestApiConnection.tsx
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../types/product.types';

const TestApiConnection: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

    useEffect(() => {
        const testConnection = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
                setConnectionStatus('connected');
                setError(null);
            } catch (err: unknown) { // 1. Change type to unknown
                setConnectionStatus('failed');

                // 2. Safely extract the error message
                let errorMessage = 'Failed to connect to backend';
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }

                setError(errorMessage);
                console.error('Backend connection error:', err);
            } finally {
                setLoading(false);
            }
        };

        testConnection();
    }, []);

    const formatPrice = (cents: number): string => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h2>Testing Backend Connection...</h2>
                <div style={styles.spinner}>Loading</div>
                <p>Attempting to connect to Django backend...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2>Backend Connection Test</h2>

            <div style={{
                ...styles.statusBox,
                backgroundColor: connectionStatus === 'connected' ? '#d4edda' : '#f8d7da',
                borderColor: connectionStatus === 'connected' ? '#c3e6cb' : '#f5c6cb',
            }}>
                <strong>Status:</strong> {connectionStatus.toUpperCase()}
                {connectionStatus === 'connected' && ' ✅'}
                {connectionStatus === 'failed' && ' ❌'}
            </div>

            {error && (
                <div style={styles.errorBox}>
                    <strong>Error:</strong> {error}
                    <div style={styles.tips}>
                        <h4>Troubleshooting Tips:</h4>
                        <ol>
                            <li>Ensure Django server is running on port 8000</li>
                            <li>Check if CORS is properly configured in Django settings</li>
                            <li>Verify the API endpoint: http://localhost:8000/api/products/</li>
                            <li>Check browser console for detailed error logs</li>
                        </ol>
                    </div>
                </div>
            )}

            {connectionStatus === 'connected' && (
                <div style={styles.successBox}>
                    <h3>Successfully connected to Django Backend!</h3>
                    <p>Found {products.length} product(s) in the database.</p>

                    {products.length > 0 && (
                        <div style={styles.productsGrid}>
                            <h4>Products Retrieved:</h4>
                            {products.map(product => (
                                <div key={product.id} style={styles.productCard}>
                                    <div style={styles.productImage}>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} style={styles.image} />
                                        ) : (
                                            <div style={styles.imagePlaceholder}>🛒</div>
                                        )}
                                    </div>
                                    <div style={styles.productInfo}>
                                        <h4>{product.name}</h4>
                                        <p><strong>Price:</strong> {formatPrice(product.priceCents)}</p>
                                        <p><strong>Rating:</strong> ⭐ {product.rating.stars} ({product.rating.count} reviews)</p>
                                        <p><strong>Keywords:</strong> {product.keywords.join(', ')}</p>
                                        <p><strong>ID:</strong> {product.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    spinner: {
        fontSize: '48px',
        textAlign: 'center' as const,
        margin: '20px 0',
    },
    statusBox: {
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid',
        margin: '20px 0',
        fontSize: '16px',
    },
    errorBox: {
        padding: '15px',
        borderRadius: '5px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        color: '#721c24',
        margin: '20px 0',
    },
    successBox: {
        padding: '15px',
        borderRadius: '5px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        color: '#155724',
        margin: '20px 0',
    },
    tips: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '4px',
    },
    productsGrid: {
        marginTop: '20px',
    },
    productCard: {
        display: 'flex' as const,
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '15px',
        margin: '10px 0',
        backgroundColor: '#fff',
    },
    productImage: {
        flex: '0 0 100px',
        marginRight: '15px',
    },
    image: {
        width: '100px',
        height: '100px',
        objectFit: 'cover' as const,
        borderRadius: '4px',
    },
    imagePlaceholder: {
        width: '100px',
        height: '100px',
        backgroundColor: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        borderRadius: '4px',
    },
    productInfo: {
        flex: 1,
    },
};

export default TestApiConnection;