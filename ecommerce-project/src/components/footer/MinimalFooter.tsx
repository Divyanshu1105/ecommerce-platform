import { Link } from 'react-router';
import './Footer.css';

export function MinimalFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer minimal-footer">
            <div className="footer-container">
                <div className="minimal-content">
                    <div className="security-badge">
                        <span>🔒</span> Secure Checkout • SSL Encrypted
                    </div>

                    <div className="minimal-copyright">
                        © {currentYear} EcommerceStore. All rights reserved.
                    </div>

                    <div className="minimal-support">
                        Need help? <Link to="/contact">Contact Support</Link> →
                    </div>
                </div>
            </div>
        </footer>
    );
}