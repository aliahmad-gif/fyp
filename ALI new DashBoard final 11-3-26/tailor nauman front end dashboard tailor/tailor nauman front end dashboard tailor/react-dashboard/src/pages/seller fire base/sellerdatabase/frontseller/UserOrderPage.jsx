import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder } from '../index';

/**
 * Alag order page – FrontSeller jaisa frontend.
 * User yahan se order karega, order Seller Dashboard par show hoga (One order aya he / Total Orders).
 */
const SAMPLE_PRODUCTS = [
    { id: '410509475', title: 'Classic White Cotton Shalwar Kameez', price: '2250', stock: '12', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM.jpeg' },
    { id: '336576372', title: 'Premium Boski Shalwar Kameez – Ivory', price: '3400', stock: '8', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (1).jpeg' },
    { id: '410509480', title: 'Designer Embroidered Kurta - Midnight Blue', price: '4250', stock: '5', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (4).jpeg' },
    { id: '410509481', title: 'Luxury Silk Blend Jalebi Design Suit', price: '6500', stock: '3', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (5).jpeg' },
];

const UserOrderPage = () => {
    const [ordered, setOrdered] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOrder = async (product) => {
        setLoading(true);
        try {
            await createOrder({
                orderId: product.id,
                productTitle: product.title,
                price: product.price,
                stock: product.stock || '',
                timestamp: new Date(),
            });
            setOrdered(product.title);
            setTimeout(() => setOrdered(null), 4000);
        } catch (e) {
            console.error('Order failed', e);
            alert('Order failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '24px', fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
            {/* Header – gradient style like FrontSeller */}
            <header style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: 'white',
                padding: '18px 20px',
                borderRadius: '14px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.25)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                        <span className="material-icons-round" style={{ fontSize: '24px' }}>storefront</span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Order Products</h1>
                        <p style={{ fontSize: '12px', opacity: 0.9, margin: '2px 0 0 0' }}>Order karein – Seller Dashboard par dikhega</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/" style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
                    <Link to="/seller" style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.95)', color: '#6366f1', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Seller Dashboard</Link>
                </div>
            </header>

            {/* Success message – same gradient style */}
            {ordered && (
                <div style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    color: 'white',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                }}>
                    <span className="material-icons-round" style={{ fontSize: '24px' }}>check_circle</span>
                    <span style={{ fontWeight: 600 }}>Order placed for "{ordered}". Ab Seller Dashboard par "One order aya he" dikhega.</span>
                </div>
            )}

            {/* Product cards – seller-card style */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {SAMPLE_PRODUCTS.map((product) => (
                    <div
                        key={product.id}
                        className="seller-card"
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1.5px solid rgba(99, 102, 241, 0.2)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div style={{ height: '180px', background: '#f3f4f6', display: 'grid', placeItems: 'center' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', marginBottom: '6px' }}>{product.title}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                <span className="material-icons-round" style={{ fontSize: '14px' }}>tag</span>
                                ID: {product.id}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--primary, #6366f1)', marginBottom: '8px' }}>
                                PKR {product.price}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginBottom: '12px' }}>
                                <span className="material-icons-round" style={{ fontSize: '14px' }}>inventory_2</span>
                                Stock: {product.stock}
                            </div>
                            <button
                                onClick={() => handleOrder(product)}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '20px' }}>shopping_bag</span>
                                {loading ? 'Placing...' : 'Order'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrderPage;
