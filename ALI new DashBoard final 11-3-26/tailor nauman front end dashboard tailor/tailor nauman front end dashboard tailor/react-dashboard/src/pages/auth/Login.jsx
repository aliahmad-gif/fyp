import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserByEmailAndRole, setCurrentUser } from '../../services/authFirebase';
import '../../Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'tailor';
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await getUserByEmailAndRole(formData.email.trim(), role);
            if (user && user.password === formData.password) {
                setCurrentUser(user);
                localStorage.setItem('isLoggedIn', 'true');
                if (role === 'tailor') {
                    navigate('/tailor');
                } else {
                    navigate('/seller');
                }
            } else {
                // Allow mock login if no Firebase user (for testing)
                if (!user) {
                    localStorage.setItem('isLoggedIn', 'true');
                    setCurrentUser({
                        id: 'mock',
                        email: formData.email,
                        role,
                        fullName: formData.email.split('@')[0],
                        phone: '',
                        shopName: role === 'seller' ? 'My Shop' : 'My Shop',
                        shopNumber: '',
                        shopAddress: '',
                    });
                    if (role === 'tailor') navigate('/tailor');
                    else navigate('/seller');
                } else {
                    alert('Invalid password.');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="container">
                <div className="auth-card">
                    <button className="back-button" onClick={() => navigate('/')}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>

                    <h1 className="title">Welcome Back</h1>
                    <p className="subtitle">Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}</p>

                    <form id="loginForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Enter your password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="link-text">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="link-text">
                        <p>Don't have an account? <Link to="/register">Register Now</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
