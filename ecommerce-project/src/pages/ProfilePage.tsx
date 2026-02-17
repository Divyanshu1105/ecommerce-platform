import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { PageMeta } from '../components/PageMeta';
import { Link } from 'react-router';
import './ProfilePage.css';

interface CartItem {
    productId: string;
    quantity: number;
    deliveryOptionId: string;
}

interface ProfilePageProps {
    cart: CartItem[];
}

export function ProfilePage({ cart }: ProfilePageProps) {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Sample data - replace with real data from API
    const recentOrders = [
        { id: 'ORD-001', date: '2026-02-15', total: 89.99, status: 'Delivered' },
        { id: 'ORD-002', date: '2026-02-10', total: 145.50, status: 'Shipped' },
    ];

    const wishlist = [
        { id: 1, name: 'Product 1', price: 29.99 },
        { id: 2, name: 'Product 2', price: 49.99 },
    ];

    const addresses = [
        { type: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', default: true },
        { type: 'Work', street: '456 Business Ave', city: 'New York', state: 'NY', zip: '10002', default: false },
    ];

    const paymentMethods = [
        { type: 'Visa', last4: '4242', expiry: '12/25', default: true },
        { type: 'Mastercard', last4: '8888', expiry: '08/24', default: false },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <PageMeta title="My Profile - Ecommerce Store" favicon="favicon.ico" />
            <Header cart={cart} />

            <div className="profile-page">
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </div>
                        <div className="profile-title">
                            <h1>Welcome, {user?.first_name} {user?.last_name}</h1>
                            <p className="profile-email">{user?.email}</p>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            Sign Out
                        </button>
                    </div>

                    {/* Profile Navigation Tabs */}
                    <div className="profile-tabs">
                        <button
                            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                        <button
                            className={`tab ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            Addresses
                        </button>
                        <button
                            className={`tab ${activeTab === 'payment' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment')}
                        >
                            Payment Methods
                        </button>
                        <button
                            className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
                            onClick={() => setActiveTab('wishlist')}
                        >
                            Wishlist
                        </button>
                        <button
                            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="profile-content">
                        {activeTab === 'overview' && (
                            <div className="overview-tab">
                                {/* Account Summary */}
                                <div className="info-card">
                                    <h2>Account Summary</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Member Since</span>
                                            <span className="info-value">February 2026</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Total Orders</span>
                                            <span className="info-value">12</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Wishlist Items</span>
                                            <span className="info-value">5</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Saved Addresses</span>
                                            <span className="info-value">2</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="info-card">
                                    <div className="card-header">
                                        <h2>Recent Orders</h2>
                                        <Link to="/orders" className="view-all">View All</Link>
                                    </div>
                                    <div className="recent-orders">
                                        {recentOrders.map(order => (
                                            <div key={order.id} className="order-row">
                                                <span className="order-id">{order.id}</span>
                                                <span className="order-date">{order.date}</span>
                                                <span className="order-total">${order.total}</span>
                                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="info-card">
                                    <h2>Quick Actions</h2>
                                    <div className="quick-actions">
                                        <Link to="/orders" className="action-button">
                                            Track Orders
                                        </Link>
                                        <Link to="/wishlist" className="action-button">
                                            View Wishlist
                                        </Link>
                                        <Link to="/addresses" className="action-button">
                                            Manage Addresses
                                        </Link>
                                        <Link to="/payment" className="action-button">
                                            Update Payment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="orders-tab">
                                <h2>Order History</h2>
                                <div className="orders-list">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="order-card">
                                            <div className="order-header">
                                                <div>
                                                    <span className="order-number">Order #ORD-00{i + 1}</span>
                                                    <span className="order-date">Placed on Feb {10 + i}, 2026</span>
                                                </div>
                                                <span className="order-total">$129.99</span>
                                            </div>
                                            <div className="order-items">
                                                <div className="order-item">
                                                    <img src="/product-thumb.jpg" alt="Product" />
                                                    <div className="item-details">
                                                        <span className="item-name">Product Name</span>
                                                        <span className="item-quantity">Qty: 2</span>
                                                    </div>
                                                    <span className="item-price">$59.99</span>
                                                </div>
                                            </div>
                                            <div className="order-footer">
                                                <span className="order-status delivered">Delivered</span>
                                                <Link to={`/tracking/ORD-00${i + 1}`} className="track-button">
                                                    Track Package
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="addresses-tab">
                                <div className="tab-header">
                                    <h2>Saved Addresses</h2>
                                    <button className="add-button">+ Add New Address</button>
                                </div>
                                <div className="addresses-grid">
                                    {addresses.map((addr, i) => (
                                        <div key={i} className={`address-card ${addr.default ? 'default' : ''}`}>
                                            {addr.default && <span className="default-badge">Default</span>}
                                            <h3>{addr.type}</h3>
                                            <p>{addr.street}</p>
                                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                                            <div className="address-actions">
                                                <button className="edit-btn">Edit</button>
                                                <button className="delete-btn">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="payment-tab">
                                <div className="tab-header">
                                    <h2>Payment Methods</h2>
                                    <button className="add-button">+ Add Payment Method</button>
                                </div>
                                <div className="payment-methods">
                                    {paymentMethods.map((method, i) => (
                                        <div key={i} className={`payment-card ${method.default ? 'default' : ''}`}>
                                            <div className="payment-icon">
                                                {method.type === 'Visa' ? '💳' : '💳'}
                                            </div>
                                            <div className="payment-details">
                                                <span className="payment-type">{method.type}</span>
                                                <span className="payment-number">•••• {method.last4}</span>
                                                <span className="payment-expiry">Expires {method.expiry}</span>
                                            </div>
                                            {method.default && <span className="default-badge">Default</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="wishlist-tab">
                                <h2>My Wishlist</h2>
                                <div className="wishlist-grid">
                                    {wishlist.map(item => (
                                        <div key={item.id} className="wishlist-item">
                                            <img src="/product-placeholder.jpg" alt={item.name} />
                                            <h3>{item.name}</h3>
                                            <p className="item-price">${item.price}</p>
                                            <button className="add-to-cart-btn">Add to Cart</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="settings-tab">
                                <h2>Account Settings</h2>
                                <div className="settings-form">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" value={user?.first_name} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" value={user?.last_name} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={user?.email} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input type="text" value={user?.username} readOnly />
                                    </div>
                                    <button className="edit-profile-btn">Edit Profile</button>
                                    <button className="change-password-btn">Change Password</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}