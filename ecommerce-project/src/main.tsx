// ecommerce-project/src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import axios from 'axios';
// import { testBackendConnection } from './utils/testBackend';
import './index.css'
import App from './App.tsx'

// Set axios default base URL
axios.defaults.baseURL = 'http://localhost:8000';

// // Expose test function to window for debugging
// if (import.meta.env.DEV) {
//   // Properly typed assignment
//   window.testBackend = testBackendConnection;
//   console.log('🔧 Debug tools available:');
//   console.log('   - testBackend() - Test Django connection');
//   console.log('   - apiService - Direct API service access');
//   console.log('   - Type "testBackend()" in console to test API');
// }

// // Add interceptors for debugging
// axios.interceptors.request.use(
//   config => {
//     console.log(` ${config.method?.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   error => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   response => {
//     console.log(` ${response.status} ${response.config.url}`);
//     return response;
//   },
//   error => {
//     console.error(' Response error:', {
//       status: error.response?.status,
//       url: error.config?.url,
//       message: error.message
//     });
//     return Promise.reject(error);
//   }
// );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)