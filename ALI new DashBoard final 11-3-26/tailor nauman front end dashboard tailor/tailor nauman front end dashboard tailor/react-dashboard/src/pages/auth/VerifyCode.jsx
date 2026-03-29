import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Auth.css';

const VerifyCode = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail') || 'tailor@example.com';
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length === 6) {
            alert("Code verified! You can now reset your password.");
            navigate('/login');
        } else {
            alert("Please enter the full 6-digit code.");
        }
    };

    const handleResend = (e) => {
        e.preventDefault();
        alert('Verification code resent!');
    };

    return (
        <div className="auth-wrapper">
            <div className="container">
                <div className="auth-card">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>

                    <h1 className="title">Enter Verification Code</h1>
                    <p className="subtitle">We sent a code to <span className="email-placeholder">{email}</span></p>

                    <form id="verifyCodeForm" onSubmit={handleSubmit}>
                        <div className="code-container">
                            {code.map((num, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    className="code-input"
                                    maxLength="1"
                                    value={num}
                                    ref={el => inputRefs.current[idx] = el}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    required
                                />
                            ))}
                        </div>

                        <button type="submit" className="btn btn-primary">Verify Code</button>
                    </form>

                    <div className="resend-link">
                        <p>Didn't receive code? <a href="#" onClick={handleResend}>Resend</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;
