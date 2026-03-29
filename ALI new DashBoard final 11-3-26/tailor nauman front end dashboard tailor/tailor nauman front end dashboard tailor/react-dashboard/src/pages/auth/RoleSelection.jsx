import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Auth.css';

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState('user');
    const navigate = useNavigate();

    useEffect(() => {
        // Initial visual feedback for default role
        const defaultOption = document.querySelector('.role-option');
        if (defaultOption) defaultOption.classList.add('selected');
    }, []);

    const handleRoleSelect = (role, event) => {
        setSelectedRole(role);

        // Visual feedback
        document.querySelectorAll('.role-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
    };

    const handleContinue = () => {
        localStorage.setItem('userRole', selectedRole);
        navigate('/login');
    };

    return (
        <div className="auth-wrapper">
            <div className="container">
                <div className="auth-card">
                    <h1 className="title">Login</h1>

                    <div className="role-selection">
                        <div className="role-option" onClick={(e) => handleRoleSelect('tailor', e)}>
                            <input
                                type="radio"
                                id="tailor-role"
                                name="userRole"
                                className="role-radio"
                                checked={selectedRole === 'tailor'}
                                readOnly
                            />
                            <label htmlFor="tailor-role" className="role-label">
                                <i className="fas fa-scissors"></i>
                                <span>Become a Tailor</span>
                            </label>
                        </div>

                        <div className="role-option" onClick={(e) => handleRoleSelect('seller', e)}>
                            <input
                                type="radio"
                                id="seller-role"
                                name="userRole"
                                className="role-radio"
                                checked={selectedRole === 'seller'}
                                readOnly
                            />
                            <label htmlFor="seller-role" className="role-label">
                                <i className="fas fa-store"></i>
                                <span>Become a Local Seller</span>
                            </label>
                        </div>
                    </div>

                    <div className="button-group">
                        <button className="btn btn-primary" onClick={handleContinue}>Continue</button>
                    </div>

                    <p className="footer-text">Select your role to proceed with login</p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
