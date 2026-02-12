import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import { productService } from '../../services/productService';
import { PageMeta } from '../../components/PageMeta';
import './HomePage.css';

export function HomePage({ cart, loadCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');

    useEffect(() => {
        const getHomeData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = search
                    ? await productService.searchProducts(search)
                    : await productService.getAllProducts();

                setProducts(data);
            } catch {
                setError('Unable to load products. Please try again.');
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
                <PageMeta title="Home - Ecommerce Store" favicon="home-favicon.png" />
                <Header cart={cart} />
                <div className="home-page">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageMeta title="Home - Ecommerce Store" favicon="home-favicon.png" />
                <Header cart={cart} />
                <div className="home-page">
                    <div className="error-state">
                        <h2>Unable to Load Products</h2>
                        <p className="error-message">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="retry-btn"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Home - Ecommerce Store" favicon="home-favicon.png" />
            <Header cart={cart} />
            <div className="home-page">
                {search && (
                    <div className="search-status">
                        Search results for: "<strong>{search}</strong>"
                    </div>
                )}
                <ProductsGrid products={products} loadCart={loadCart} />
            </div>
        </>
    );
}