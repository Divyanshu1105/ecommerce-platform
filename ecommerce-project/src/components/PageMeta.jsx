import { useEffect } from 'react';

const pageConfig = {
    '/': {
        title: 'Home - Ecommerce Store',
        favicon: 'home-favicon.png'
    },
    '/checkout': {
        title: 'Checkout - Ecommerce Store',
        favicon: 'cart-favicon.png'
    },
    '/orders': {
        title: 'Your Orders - Ecommerce Store',
        favicon: 'orders-favicon.png'
    },
    '/tracking': {
        title: 'Order Tracking - Ecommerce Store',
        favicon: 'tracking-favicon.png'
    },
    'default': {
        title: 'Ecommerce Store',
        favicon: 'favicon.ico'
    }
};

export function PageMeta({ title, favicon }) {
    useEffect(() => {
        // Update page title
        if (title) {
            document.title = title;
        }

        // Update favicon
        if (favicon) {
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/png';
            link.rel = 'icon';
            link.href = `/favicons/${favicon}`;

            if (!document.querySelector("link[rel*='icon']")) {
                document.head.appendChild(link);
            }
        }
    }, [title, favicon]);

    return null;
}