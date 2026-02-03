// ecommerce-project/src/pages/home/HomePage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import { productService } from '../../services/productService'; // Use your service
import './HomePage.css';

export function HomePage({ cart, loadCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');

    useEffect(() => {
        const getHomeData = async () => {
            try {
                setLoading(true);
                setError(null);

                let data;
                if (search) {
                    // Use searchProducts from your service
                    data = await productService.searchProducts(search);
                } else {
                    // Use getAllProducts from your service
                    data = await productService.getAllProducts();
                }
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(`Failed to load products: ${err.message || 'Unknown error'}`);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        getHomeData();
    }, [search]);

    if (loading) {
        return (
            <>
                <title>Ecommerce Project - Loading...</title>
                <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
                <Header cart={cart} />
                <div className="home-page">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Connecting to Django backend...</p>
                        <p className="hint">Make sure Django is running on port 8000</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <title>Ecommerce Project - Error</title>
                <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
                <Header cart={cart} />
                <div className="home-page">
                    <div className="error-state">
                        <h2>⚠️ Connection Error</h2>
                        <p className="error-message">{error}</p>

                        <div className="troubleshooting">
                            <h3>Quick Fixes:</h3>
                            <ol>
                                <li>
                                    <strong>Start Django backend:</strong><br />
                                    <code>cd ecommerce-backend && python manage.py runserver</code>
                                </li>
                                <li>
                                    <strong>Test API directly:</strong><br />
                                    <a href="http://localhost:8000/api/products/" target="_blank" rel="noopener noreferrer">
                                        Click here to test Django API
                                    </a>
                                </li>
                                <li>
                                    <strong>Check console (F12) for detailed errors</strong>
                                </li>
                                <li>
                                    <strong>Visit test page:</strong><br />
                                    <a href="/test-api">Go to API Test Page</a>
                                </li>
                            </ol>

                            <button
                                onClick={() => window.location.reload()}
                                className="retry-btn"
                            >
                                ↻ Retry Loading
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
            <Header cart={cart} />
            <div className="home-page">
                <div className="connection-status success">
                    ✅ Connected to Django API • {products.length} products loaded
                </div>

                {search && (
                    <div className="search-status">
                        🔍 Search results for: "<strong>{search}</strong>"
                    </div>
                )}

                <ProductsGrid products={products} loadCart={loadCart} />
            </div>
        </>
    );
}