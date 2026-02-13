import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import CartIcon from '../assets/images/icons/cart-icon.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import LogoWhite from '../assets/images/logo-white.jpg';
import MobileLogoWhite from '../assets/images/mobile-logo-white.png';
import UserIcon from '../assets/images/icons/user-icon.png'; // You'll need to add this
import './Header.css';

type HeaderProps = {
    cart: {
        productId: string;
        quantity: number;
        deliveryOptionId: string;
    }[];
};

// Temporary auth state - will be replaced with real auth
const DEMO_USER = null; // Set to { name: 'Divyanshu' } to test logged in state

export function Header({ cart = [] }: HeaderProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchText = searchParams.get('search');
    const [search, setSearch] = useState(searchText || '');

    // Auth state - replace with real auth context later
    const [user, setUser] = useState(DEMO_USER);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const updateSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const searchProducts = () => {
        navigate(`/?search=${search}`);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            searchProducts();
        }
    };

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="header">
            <div className="header-left-section">
                <NavLink to="/" className="header-logo-link">
                    <img className="header-logo" src={LogoWhite} alt="Ecommerce Store" />
                    <img className="header-mobile-logo" src={MobileLogoWhite} alt="Ecommerce Store" />
                </NavLink>
            </div>

            <div className="header-middle-section">
                <div className="search-container">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={updateSearchInput}
                        onKeyDown={handleKeyPress}
                    />
                    <button className="search-button" onClick={searchProducts}>
                        <img className="search-icon" src={SearchIcon} alt="Search" />
                    </button>
                </div>
            </div>

            <div className="header-right-section">
                {/* Auth Section */}
                <div className="auth-section">
                    {user ? (
                        <div className="user-menu">
                            <button
                                className="user-menu-button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <img className="user-icon" src={UserIcon} alt="User" />
                                <span className="user-name">{user.name}</span>
                                <span className="dropdown-arrow">▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <NavLink to="/profile" className="dropdown-item">
                                        Your Profile
                                    </NavLink>
                                    <NavLink to="/orders" className="dropdown-item">
                                        Your Orders
                                    </NavLink>
                                    <hr className="dropdown-divider" />
                                    <button className="dropdown-item logout-btn">
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="guest-menu">
                            <NavLink to="/login" className="auth-link signin-link">
                                <img className="user-icon" src={UserIcon} alt="User" />
                                <span>Sign In</span>
                            </NavLink>
                            <span className="auth-separator">|</span>
                            <NavLink to="/register" className="auth-link register-link">
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Orders Link */}
                <NavLink className="orders-link" to="/orders">
                    <span className="orders-text">Orders</span>
                </NavLink>

                {/* Cart Link */}
                <NavLink className="cart-link" to="/checkout">
                    <div className="cart-icon-container">
                        <img className="cart-icon" src={CartIcon} alt="Cart" />
                        {totalQuantity > 0 && (
                            <span className="cart-badge">{totalQuantity}</span>
                        )}
                    </div>
                    <span className="cart-text">Cart</span>
                </NavLink>
            </div>
        </header>
    );
}