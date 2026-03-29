import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'tailor';
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock sending code
        localStorage.setItem('resetEmail', email);
        navigate('/verify');
    };

    return (
        <div className="auth-wrapper">
            <div className="container">
                <div className="auth-card">
                    <button className="back-button" onClick={() => navigate('/login')}>
                        <i className="fas fa-arrow-left"></i> Back to Login
                    </button>

                    <h1 className="title">Forgot Password?</h1>
                    <p className="subtitle">Enter your email to receive verification code</p>

                    <form id="forgotPasswordForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Send Verification Code</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
