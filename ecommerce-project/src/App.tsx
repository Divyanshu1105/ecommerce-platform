import axios from 'axios';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/home/HomePage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    try {
      const response = await axios.get('/api/cart-items/?expand=product');
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage cart={cart} loadCart={loadCart} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage cart={cart} loadCart={loadCart} />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage cart={cart} loadCart={loadCart} />
          </ProtectedRoute>
        } />
        <Route path="/tracking/:orderId/:productId" element={
          <ProtectedRoute>
            <TrackingPage cart={cart} />
          </ProtectedRoute>
        } />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage cart={cart} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;