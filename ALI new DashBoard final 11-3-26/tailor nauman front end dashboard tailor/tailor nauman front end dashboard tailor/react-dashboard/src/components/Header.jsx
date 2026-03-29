import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authFirebase';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();

    const getHeaderTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Analytics';
            case '/analytics': return 'Analytics';
            case '/orders': return 'All Orders';
            case '/reviews': return 'Customer Reviews';
            case '/income': return 'Financial Overview';
            case '/messages': return 'Messages';
            case '/profile': return 'Me';
            default: return 'Dashboard';
        }
    };

    return (
        <header className="global-header">
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h2 id="header-title">{getHeaderTitle(location.pathname)}</h2>
            </div>
            <div className="header-right" onClick={() => navigate('/tailor/profile')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <div style={{ textAlign: 'right' }}>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{user?.fullName || user?.shopName || 'Tailor'}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'gray', margin: 0 }}>{user?.shopName || 'Tailor Shop'}</p>
                </div>
                <img src={user?.fullName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0D8ABC&color=fff` : '/images/2.png'} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="User" />
            </div>
        </header>
    );
};

export default Header;
