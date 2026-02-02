export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};

// Environment variable example for production
// Add to your .env file: VITE_API_BASE_URL=http://your-production-domain.com/api