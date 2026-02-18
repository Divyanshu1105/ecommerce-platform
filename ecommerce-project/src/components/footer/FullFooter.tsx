import { Link } from 'react-router';
import './Footer.css';

export function FullFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer full-footer">
            <div className="footer-container">

                {/* Main Footer Grid */}
                <div className="footer-grid">

                    {/* Column 1: About */}
                    <div className="footer-col">
                        <h3 className="footer-title">About Us</h3>
                        <ul className="footer-links">
                            <li><Link to="/about">Our Story</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                            <li><Link to="/press">Press</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Customer Support */}
                    <div className="footer-col">
                        <h3 className="footer-title">Support</h3>
                        <ul className="footer-links">
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/returns">Returns & Exchanges</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div className="footer-col">
                        <h3 className="footer-title">Policies</h3>
                        <ul className="footer-links">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/shipping">Shipping Information</Link></li>
                            <li><Link to="/cancellation">Cancellation Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div className="footer-col">
                        <h3 className="footer-title">Connect</h3>
                        <div className="social-links">
                            <a href="#" className="social-link">📘 Facebook</a>
                            <a href="#" className="social-link">🐦 Twitter</a>
                            <a href="#" className="social-link">📷 Instagram</a>
                            <a href="#" className="social-link">▶️ YouTube</a>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="newsletter">
                    <h4>Get 10% off your first order!</h4>
                    <p>Subscribe to our newsletter for exclusive deals</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Your email address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>

                {/* Payment Methods */}
                <div className="payment-methods">
                    <span>We Accept: </span>
                    <span className="payment-badge">Visa</span>
                    <span className="payment-badge">Mastercard</span>
                    <span className="payment-badge">PayPal</span>
                    <span className="payment-badge">Apple Pay</span>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>© {currentYear} EcommerceStore. All rights reserved.</p>
                    <div className="legal-links">
                        <Link to="/privacy">Privacy</Link>
                        <span>•</span>
                        <Link to="/terms">Terms</Link>
                        <span>•</span>
                        <Link to="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}