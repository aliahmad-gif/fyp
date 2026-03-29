import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

export const INITIAL_PRODUCTS = {
    active: [
        { id: '410509475', title: 'Classic White Cotton Shalwar Kameez', status: 'Active', price: '2250', stock: '28993', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM.jpeg' },
        { id: '336576372', title: 'Premium Boski Shalwar Kameez – Ivory', status: 'Active', price: '3400', stock: '998', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (1).jpeg' },
        { id: '410509480', title: 'Designer Embroidered Kurta - Midnight Blue', status: 'Active', price: '4250', stock: '45', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (4).jpeg' },
        { id: '410509481', title: 'Luxury Silk Blend Jalebi Design Suit', status: 'Active', price: '6500', stock: '12', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (5).jpeg' }
    ],
    inactive: [
        { id: '510509476', title: 'Luxury Blended Fabric Shalwar Kameez', status: 'Inactive', price: '4500', stock: '150', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (2).jpeg' }
    ],
    pending: [
        { id: '610509477', title: 'Classic White Cotton Shalwar Kameez', status: 'Pending', price: '5000', stock: '25', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (3).jpeg' }
    ]
};

const SellerProducts = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [editingPriceId, setEditingPriceId] = useState(null);
    const navigate = useNavigate();

    const tabs = ['Active', 'Inactive', 'Pending'];

    const updatePrice = (productId, newPrice) => {
        setProducts((prev) => {
            const next = { active: [...prev.active], inactive: [...prev.inactive], pending: [...prev.pending] };
            const updateIn = (arr) => arr.map((p) => (p.id === productId ? { ...p, price: String(newPrice) } : p));
            next.active = updateIn(next.active);
            next.inactive = updateIn(next.inactive);
            next.pending = updateIn(next.pending);
            return next;
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return { background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', borderColor: '#4CAF50' };
            case 'Inactive': return { background: 'rgba(158, 158, 158, 0.15)', color: '#9E9E9E', borderColor: '#9E9E9E' };
            case 'Pending': return { background: 'rgba(255, 152, 0, 0.15)', color: '#FF9800', borderColor: '#FF9800' };
            default: return {};
        }
    };

    const activeProducts = activeTab === 0 ? products.active : activeTab === 1 ? products.inactive : products.pending;

    useEffect(() => {
        const headings = ['Products', 'Active', 'Inactive', 'Pending'];
        saveHeadings('SellerProducts', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            {/* App Bar */}
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} title="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Products</div>
                </div>
                <div
                    style={{ padding: '8px', cursor: 'pointer', borderRadius: '12px' }}
                    onClick={() => navigate('/seller/add-product')}
                >
                    <span className="material-icons-round" style={{ color: 'black' }}>add</span>
                </div>
            </header>

            {/* Tabs Header */}
            <div className="seller-tabs-container" style={{ background: 'white', padding: '0 1rem' }}>
                <div className="seller-tabs-header" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`seller-tab-btn ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'none',
                                border: 'none',
                                fontWeight: 700,
                                color: activeTab === index ? 'var(--primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === index ? '3px solid var(--primary)' : 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="seller-tab-content-area" style={{ padding: '16px', background: '#f9f9f9', minHeight: 'calc(100vh - 180px)' }}>
                {activeProducts.map((product) => (
                    <div key={product.id} className="seller-product-card" style={{ background: 'white', borderRadius: '16px', border: '1.5px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div className="seller-product-image-box" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                    <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                </div>
                                <div className="seller-product-details" style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div className="seller-product-title" style={{ fontWeight: 700, fontSize: '16px' }}>{product.title}</div>
                                        <div className="seller-status-badge" style={{ ...getStatusStyle(product.status), padding: '4px 8px', borderRadius: '8px', fontSize: '10px', border: '1px solid' }}>
                                            {product.status}
                                        </div>
                                    </div>
                                    <div className="seller-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                        <span className="material-icons-round" style={{ fontSize: '14px' }}>tag</span>
                                        <span>ID: {product.id}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>PKR</span>
                                        {editingPriceId === product.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={product.price}
                                                    onChange={(e) => updatePrice(product.id, e.target.value)}
                                                    onBlur={() => setEditingPriceId(null)}
                                                    autoFocus
                                                    style={{
                                                        width: '100px',
                                                        padding: '6px 10px',
                                                        fontSize: '16px',
                                                        fontWeight: 700,
                                                        color: 'var(--primary)',
                                                        border: '1px solid rgba(99, 102, 241, 0.5)',
                                                        borderRadius: '8px',
                                                        background: '#fff'
                                                    }}
                                                />
                                                <button type="button" onClick={() => setEditingPriceId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: 'var(--primary)' }} title="Done">
                                                    <span className="material-icons-round" style={{ fontSize: '20px' }}>check</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>{product.price}</span>
                                                <button type="button" onClick={() => setEditingPriceId(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: 'var(--primary)' }} title="Edit price">
                                                    <span className="material-icons-round" style={{ fontSize: '20px' }}>edit</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="seller-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, marginTop: '6px', color: '#666' }}>
                                        <span className="material-icons-round" style={{ fontSize: '14px' }}>inventory_2</span>
                                        <span>Stock: {product.stock}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerProducts;
