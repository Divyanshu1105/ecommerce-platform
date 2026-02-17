// ecommerce-project/src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';
import './index.css'
import App from './App.tsx'

// Set axios default base URL
axios.defaults.baseURL = 'http://localhost:8000';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)