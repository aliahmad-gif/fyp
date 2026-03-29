import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authFirebase';
import '../../Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'tailor';
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        shopName: '',
        shopNumber: '',
        shopAddress: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStep1Next = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser({
                email: formData.email,
                password: formData.password,
                role,
                fullName: formData.fullName,
                phone: formData.phone,
                shopName: formData.shopName,
                shopNumber: formData.shopNumber,
                shopAddress: formData.shopAddress,
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error('Register error:', err);
            alert('Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="container">
                <div className="auth-card">
                    <button className="back-button" onClick={() => step === 1 ? navigate('/login') : setStep(1)}>
                        <i className="fas fa-arrow-left"></i> {step === 1 ? 'Back to Login' : 'Back'}
                    </button>

                    <h1 className="title">Create Account</h1>
                    <p className="subtitle">Register as {role.charAt(0).toUpperCase() + role.slice(1)} · Step {step} of 2</p>

                    {step === 1 ? (
                        <form id="registerFormStep1" onSubmit={handleStep1Next}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-user"></i>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-envelope"></i>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        placeholder="Create a password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Next</button>
                        </form>
                    ) : (
                        <form id="registerFormStep2" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="shopName">Shop Name</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-store"></i>
                                    <input
                                        type="text"
                                        id="shopName"
                                        name="shopName"
                                        placeholder="Enter your shop name"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="shopNumber">Shop Number</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-hashtag"></i>
                                    <input
                                        type="text"
                                        id="shopNumber"
                                        name="shopNumber"
                                        placeholder="Enter shop number"
                                        value={formData.shopNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-phone"></i>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="shopAddress">Shop Address</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <input
                                        type="text"
                                        id="shopAddress"
                                        name="shopAddress"
                                        placeholder="Enter your shop address"
                                        value={formData.shopAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    <div className="link-text">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
