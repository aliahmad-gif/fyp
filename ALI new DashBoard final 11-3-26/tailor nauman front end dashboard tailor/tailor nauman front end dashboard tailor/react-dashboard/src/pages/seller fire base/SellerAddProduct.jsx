import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

const SellerAddProduct = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Submit Product');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        setTimeout(() => {
            alert("Product submitted for review!");
            navigate('/seller/products');
        }, 1500);
    };

    useEffect(() => {
        const headings = ['Add New Product', 'Product Title', 'Category', 'Price', 'Stock Quantity'];
        saveHeadings('SellerAddProduct', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Add New Product</div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Product Title</label>
                            <input type="text" placeholder="Enter product name" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Category</label>
                            <select style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', background: '#f9fafb' }}>
                                <option>Shalwar Kameez</option>
                                <option>Kurta</option>
                                <option>Waistcoat</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Price (PKR)</label>
                            <input type="number" placeholder="0.00" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Stock Quantity</label>
                            <input type="number" placeholder="0" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px' }} required />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Product Images</label>
                            <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}>
                                <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--primary)' }}>add_a_photo</span>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Click to upload images</div>
                            </div>
                        </div>

                        <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: '16px', marginTop: '10px' }}>
                            {status}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerAddProduct;
