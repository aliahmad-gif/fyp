import React, { useState, useMemo } from 'react';
import { getCurrentUser } from '../services/authFirebase';

const ProfilePage = () => {
    const currentUser = useMemo(() => getCurrentUser(), []);
    const [view, setView] = useState('main'); // 'main', 'seller', 'bank'
    const [isEditing, setIsEditing] = useState({ seller: false, bank: false });

    const [sellerData, setSellerData] = useState(() => ({
        fullName: currentUser?.fullName || 'Nauman Irshad',
        shopName: currentUser?.shopName || 'Tailor Shop',
        shopNumber: currentUser?.shopNumber || '',
        email: currentUser?.email || 'nauman@example.com',
        phone: currentUser?.phone || '+92 300 1234567',
        address: currentUser?.shopAddress || 'Shop #4, Main Market, Lahore'
    }));

    const [bankData, setBankData] = useState({
        bankName: 'Meezan Bank',
        accountTitle: 'Nauman Irshad',
        iban: 'PK36 MEZN 0000 0000 1234 5678',
        branchCode: '0231'
    });

    const toggleEdit = (type) => {
        setIsEditing(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const saveDetails = (type) => {
        alert('Changes saved successfully!');
        setIsEditing(prev => ({ ...prev, [type]: false }));
    };

    const handleSellerChange = (e) => {
        const { name, value } = e.target;
        setSellerData(prev => ({ ...prev, [name]: value }));
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section className="view-section active">
            {view === 'main' ? (
                <div id="profile-main-grid">
                    <div className="profile-banner">
                        <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '24px', padding: '2px' }}>
                            <img
                                src={currentUser?.fullName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&size=100` : '/images/2.png'}
                                style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }}
                                alt="Profile"
                            />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{sellerData.fullName}</h1>
                            <p>Shop ID: PK2NBNTP4TH</p>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>4.9</h3>
                            <span>RATING</span>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>Account Settings</h2>
                    <div className="settings-grid">
                        <div className="settings-card" onClick={() => setView('seller')}>
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'var(--primary-light)',
                                    borderRadius: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Seller Account</h3>
                            <p style={{ color: 'gray' }}>Manage personal details.</p>
                        </div>
                        <div className="settings-card" onClick={() => setView('bank')}>
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'var(--primary-light)',
                                    borderRadius: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bank Account</h3>
                            <p style={{ color: 'gray' }}>Payout preferences.</p>
                        </div>
                    </div>
                </div>
            ) : view === 'seller' ? (
                <div id="seller-details" style={{ marginTop: '2rem' }}>
                    <button
                        onClick={() => setView('main')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>{' '}
                        Back to Profile
                    </button>
                    <div className="detail-card">
                        <div className="detail-header">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Seller Account</h2>
                            <button className="edit-icon-btn" onClick={() => toggleEdit('seller')}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); saveDetails('seller'); }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-input"
                                    value={sellerData.fullName}
                                    onChange={handleSellerChange}
                                    disabled={!isEditing.seller}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Shop Name</label>
                                <input
                                    type="text"
                                    name="shopName"
                                    className="form-input"
                                    value={sellerData.shopName}
                                    onChange={handleSellerChange}
                                    disabled={!isEditing.seller}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Shop Number</label>
                                <input
                                    type="text"
                                    name="shopNumber"
                                    className="form-input"
                                    value={sellerData.shopNumber}
                                    onChange={handleSellerChange}
                                    disabled={!isEditing.seller}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={sellerData.email}
                                    onChange={handleSellerChange}
                                    disabled={!isEditing.seller}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-input"
                                    value={sellerData.phone}
                                    onChange={handleSellerChange}
                                    disabled={!isEditing.seller}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Shop Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-input"
                                    value={sellerData.address}
                                    onChange={handleSellerChange}
                                    disabled={!isEditing.seller}
                                />
                            </div>
                            {isEditing.seller && (
                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="action-btn">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            ) : (
                <div id="bank-details" style={{ marginTop: '2rem' }}>
                    <button
                        onClick={() => setView('main')}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>{' '}
                        Back to Profile
                    </button>
                    <div className="detail-card">
                        <div className="detail-header">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bank Information</h2>
                            <button className="edit-icon-btn" onClick={() => toggleEdit('bank')}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); saveDetails('bank'); }}>
                            <div className="form-group">
                                <label className="form-label">Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    className="form-input"
                                    value={bankData.bankName}
                                    onChange={handleBankChange}
                                    disabled={!isEditing.bank}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Account Title</label>
                                <input
                                    type="text"
                                    name="accountTitle"
                                    className="form-input"
                                    value={bankData.accountTitle}
                                    onChange={handleBankChange}
                                    disabled={!isEditing.bank}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">IBAN / Account Number</label>
                                <input
                                    type="text"
                                    name="iban"
                                    className="form-input"
                                    value={bankData.iban}
                                    onChange={handleBankChange}
                                    disabled={!isEditing.bank}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Branch Code</label>
                                <input
                                    type="text"
                                    name="branchCode"
                                    className="form-input"
                                    value={bankData.branchCode}
                                    onChange={handleBankChange}
                                    disabled={!isEditing.bank}
                                />
                            </div>
                            {isEditing.bank && (
                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="action-btn">
                                        Update Details
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfilePage;
