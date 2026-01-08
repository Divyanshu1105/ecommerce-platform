import axios from 'axios';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/home/HomePage'
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css'

window.axios = axios;

function App() {
  const [cart, setCart] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/cart-items?expand=product')
  //     .then((response) => {
  //       setCart(response.data);
  //     });
  // }, []);
  const loadCart = async () => {
    const response = await axios.get('/api/cart-items?expand=product');
    setCart(response.data);
  }
  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />}></Route> */}
      <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route path="/checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
      <Route path="/orders" element={<OrdersPage loadCart={loadCart} />} />
      <Route path="/tracking/:orderId/:productId" element={<TrackingPage />} />
      <Route path="*" element={<NotFoundPage cart={cart} />} />
    </Routes>
  )
}

export default App
