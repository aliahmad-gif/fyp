import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder } from './seller fire base/sellerdatabase';

/**
 * User/Customer shop – user yahan product par "Order" click karega.
 * Order Firebase mein jayega, seller ko dashboard par "One order aya he" dikhega.
 */
const SAMPLE_PRODUCTS = [
    { id: '410509475', title: 'Classic White Cotton Shalwar Kameez', price: '2250', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM.jpeg' },
    { id: '336576372', title: 'Premium Boski Shalwar Kameez – Ivory', price: '3400', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (1).jpeg' },
    { id: '410509480', title: 'Designer Embroidered Kurta - Midnight Blue', price: '4250', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (4).jpeg' },
    { id: '410509481', title: 'Luxury Silk Blend Jalebi Design Suit', price: '6500', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (5).jpeg' },
];

const UserShop = () => {
    const [ordered, setOrdered] = useState(null);

    const handleOrder = async (product) => {
        try {
            await createOrder({
                orderId: `ORD-${Date.now()}`,
                productTitle: product.title,
                price: product.price,
                productId: product.id,
                source: 'user',
                timestamp: new Date(),
            });
            setOrdered(product.title);
            setTimeout(() => setOrdered(null), 3000);
        } catch (e) {
            console.error('Order failed', e);
            alert('Order failed. Try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', margin: 0 }}>Shop – Products</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/" style={{ padding: '8px 16px', background: '#e5e7eb', color: '#374151', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
                    <Link to="/seller" style={{ padding: '8px 16px', background: '#6366f1', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Seller Dashboard</Link>
                </div>
            </header>

            {ordered && (
                <div style={{ background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600 }}>
                    Order placed for "{ordered}". Seller ko ab dashboard par "One order aya he" dikhega.
                </div>
            )}

            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Product par <strong>Order</strong> click karein – order seller ke dashboard par jaa kar dikhega (One order aya he).</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {SAMPLE_PRODUCTS.map((product) => (
                    <div key={product.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
                        <div style={{ height: '180px', background: '#f3f4f6', display: 'grid', placeItems: 'center' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                        <div style={{ padding: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#1f2937' }}>{product.title}</h3>
                            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', margin: '0 0 12px 0' }}>PKR {product.price}</p>
                            <button
                                onClick={() => handleOrder(product)}
                                style={{ width: '100%', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserShop;
