import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

const SellerAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shortCode: 'P2NBNTP**',
        fullName: 'Ali Ahmad',
        email: 'AliAhmad@gmail.com',
        phone: '+92 046161****',
        shopName: 'Ali-Ahmad.Store'
    });
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            alert("Information updated successfully!");
        }, 800);
    };

    useEffect(() => {
        const headings = ['Seller Account', 'Short Code', 'Full Name', 'Email', 'Phone', 'Shop Name'];
        saveHeadings('SellerAccount', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Seller Account</div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Short Code</label>
                            <input type="text" value={formData.shortCode} readOnly style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                First and Last Name <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Internal Contact Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Contact Mobile Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Display Name / Shop Name <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                            </label>
                            <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }} />
                        </div>

                        <button type="submit" style={{ background: isSaved ? '#1F9D6E' : 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: '16px', transition: 'background 0.2s', marginTop: '10px' }}>
                            {isSaved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerAccount;
