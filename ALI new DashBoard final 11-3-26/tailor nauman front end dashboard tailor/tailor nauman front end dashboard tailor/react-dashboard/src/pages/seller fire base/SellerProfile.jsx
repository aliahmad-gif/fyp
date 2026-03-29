import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';
import { getCurrentUser } from '../../services/authFirebase';

const SellerProfile = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userRole');
            navigate('/');
        }
    };

    const options = [
        { label: 'Seller Account', icon: 'person_outline', path: '/seller/profile/seller-account' },
        { label: 'Bank Account', icon: 'account_balance', path: '/seller/profile/bank-account' },
        { label: 'Business Account', icon: 'business', path: '/seller/profile/business-account' }
    ];

    useEffect(() => {
        const headings = ['Ali Ahmad Store', 'Seller Account', 'Bank Account', 'Business Account'];
        saveHeadings('SellerProfile', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>{user?.shopName || user?.fullName || 'Profile'}</div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#e5e7eb', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.shopName || 'S')}&size=56`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-main)' }}>{user?.fullName || user?.shopName || 'Seller'}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{user?.shopName || '—'}</div>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>Your Details</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '20px' }}>mail</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                            <span style={{ fontWeight: 500 }}>{user?.email || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '20px' }}>phone</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                            <span style={{ fontWeight: 500 }}>{user?.phone || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '20px' }}>store</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Shop Name:</span>
                            <span style={{ fontWeight: 500 }}>{user?.shopName || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '20px' }}>tag</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Shop Number:</span>
                            <span style={{ fontWeight: 500 }}>{user?.shopNumber || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '20px', marginTop: '2px' }}>location_on</span>
                            <div>
                                <span style={{ color: 'var(--text-secondary)' }}>Shop Address: </span>
                                <span style={{ fontWeight: 500 }}>{user?.shopAddress || '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Number of days as a seller:</div>
                    <div style={{ fontWeight: 700, fontSize: '22px', color: 'var(--success-text)' }}>—</div>
                </div>

                {options.map((option, idx) => (
                    <Link key={idx} to={option.path} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                        <span className="material-icons-round" style={{ color: 'rgba(0, 0, 0, 0.54)', marginRight: '12px' }}>{option.icon}</span>
                        <div style={{ fontSize: '16px', color: 'var(--text-main)', flex: 1 }}>{option.label}</div>
                        <span className="material-icons-round" style={{ color: 'grey', fontSize: '16px' }}>arrow_forward_ios</span>
                    </Link>
                ))}

                <button onClick={handleLogout} style={{ marginTop: '30px', background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 40px', borderRadius: '8px', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                    <span className="material-icons-round">logout</span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SellerProfile;
