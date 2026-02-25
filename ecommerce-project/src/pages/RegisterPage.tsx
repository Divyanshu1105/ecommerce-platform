import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { PageMeta } from '../components/PageMeta';
import './AuthPages.css';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: ''
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err: unknown) {
            setErrors(err as Record<string, string[]>);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageMeta title="Create Account - Ecommerce Store" favicon="favicon.ico" />
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Start shopping with us today!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                    placeholder="John"
                                />
                                {errors.first_name?.map((err, i) => (
                                    <span key={i} className="field-error">{err}</span>
                                ))}
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                    placeholder="Doe"
                                />
                                {errors.last_name?.map((err, i) => (
                                    <span key={i} className="field-error">{err}</span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                placeholder="johndoe123"
                            />
                            {errors.username?.map((err, i) => (
                                <span key={i} className="field-error">{err}</span>
                            ))}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="john@example.com"
                            />
                            {errors.email?.map((err, i) => (
                                <span key={i} className="field-error">{err}</span>
                            ))}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="••••••••"
                            />
                            {errors.password?.map((err, i) => (
                                <span key={i} className="field-error">{err}</span>
                            ))}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <input
                                type="password"
                                id="password2"
                                value={formData.password2}
                                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                                required
                                placeholder="••••••••"
                            />
                            {errors.password2?.map((err, i) => (
                                <span key={i} className="field-error">{err}</span>
                            ))}
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}