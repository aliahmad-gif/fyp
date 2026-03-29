import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createTailorOrder } from '../index';

const SAMPLE_ITEMS = [
    { id: 'T001', title: 'Men\'s Stitched Suit', price: '4500', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM.jpeg' },
    { id: 'T002', title: 'Women\'s Embroidered Kurta', price: '3200', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (1).jpeg' },
    { id: 'T003', title: 'Custom Blazer', price: '5500', image: '/WhatsApp Image 2025-12-31 at 12.28.39 AM (4).jpeg' },
    { id: 'T004', title: 'Shalwar Kameez', price: '2800', image: '' },
    { id: 'T005', title: 'Waistcoat', price: '3500', image: '' },
];

const TailorOrderPage = () => {
    const [ordered, setOrdered] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imgErrors, setImgErrors] = useState(() => new Set());
    const onImgError = (id) => setImgErrors((prev) => new Set(prev).add(id));

    const handleOrder = async (item) => {
        setLoading(true);
        try {
            await createTailorOrder({
                orderId: item.id,
                productTitle: item.title,
                price: item.price,
                image: item.image || '',
                timestamp: new Date(),
            });
            setOrdered(item.title);
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
            <header style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
                color: 'white',
                padding: '18px 20px',
                borderRadius: '14px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.25)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                        <span className="material-icons-round" style={{ fontSize: '24px' }}>checkroom</span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Tailor Orders</h1>
                        <p style={{ fontSize: '12px', opacity: 0.9, margin: '2px 0 0 0' }}>Order karein – Tailor Dashboard par dikhega</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/" style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
                    <Link to="/tailor" style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.95)', color: '#4F46E5', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Tailor Dashboard</Link>
                </div>
            </header>

            {ordered && (
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
                    color: 'white',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                }}>
                    <span className="material-icons-round" style={{ fontSize: '24px' }}>check_circle</span>
                    <span style={{ fontWeight: 600 }}>Order placed for "{ordered}". Ab Tailor Dashboard par "One order aya he" dikhega.</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {SAMPLE_ITEMS.map((item) => (
                    <div key={item.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1.5px solid rgba(79, 70, 229, 0.2)' }}>
                        <div style={{ height: '160px', background: '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
                            {item.image && !imgErrors.has(item.id) ? (
                                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => onImgError(item.id)} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-icons-round" style={{ fontSize: '64px', color: '#9ca3af' }}>checkroom</span>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{item.title}</div>
                            <div style={{ fontWeight: 700, fontSize: '18px', color: '#4F46E5', marginBottom: '12px' }}>PKR {item.price}</div>
                            <button
                                onClick={() => handleOrder(item)}
                                disabled={loading}
                                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
                            >
                                {loading ? 'Placing...' : 'Order'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TailorOrderPage;
