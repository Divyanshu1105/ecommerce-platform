
export { }; // Important: This makes it a module

declare global {
    interface Window {
        testBackend: () => Promise<{
            directConnection?: boolean;
            proxyConnection?: boolean;
            apiServiceWorking?: boolean;
            productsCount?: number;
            error?: string;
            success?: boolean;
        }>;
    }
}