import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/home/HomePage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import './App.css';

// Create a separate component that uses auth
function AppContent() {
  const [cart, setCart] = useState([]);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      const response = await axios.get('/api/cart-items/?expand=product');
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [authLoading, loadCart]);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
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

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage cart={cart} />
        </ProtectedRoute>
      } />
    </Routes>


  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;