import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenForOrders } from './tailor firebase';

function formatOrderDate(timestamp) {
    if (!timestamp) return '—';
    const ms = timestamp?.toMillis?.() ?? (timestamp instanceof Date ? timestamp.getTime() : timestamp);
    return new Date(ms).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

const OrdersPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All Orders');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [imageErrors, setImageErrors] = useState(() => new Set());
    const onImageError = (orderId) => setImageErrors((prev) => new Set(prev).add(orderId));

    useEffect(() => {
        const unsubscribe = listenForOrders((ordersList) => {
            setOrders(ordersList || []);
        });
        return () => unsubscribe();
    }, []);

    const sortedOrders = [...orders].sort((a, b) => {
        const t = (o) => o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
        return t(b) - t(a);
    });

    const filteredOrders = filter === 'All Orders'
        ? sortedOrders
        : filter === 'Active'
            ? sortedOrders.filter(o => (o.status || 'New') !== 'Delivered' && (o.status || 'New') !== 'Cancelled')
            : filter === 'Completed'
                ? sortedOrders.filter(o => (o.status || '') === 'Delivered')
                : filter === 'Cancelled'
                    ? sortedOrders.filter(o => (o.status || '') === 'Cancelled')
                    : sortedOrders;

    return (
        <section className="view-section active">
            <div className="page-header" style={{ display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 style={{ fontWeight: 700 }}>All Orders</h2>
                </div>

                <div className="filter-tabs">
                    {['All Orders', 'Active', 'Completed', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            className={`filter-tab ${filter === tab ? 'active' : ''}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="order-list">
                {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        Abhi koi order nahi. User <strong>/tailor-order</strong> se order karega to yahan dikhega.
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="order-card-detailed">
                            <div className="order-header-row">
                                <div>
                                    <h3 style={{ fontWeight: 700 }}>#{order.orderId || order.id}</h3>
                                    <small style={{ color: 'gray' }}>{formatOrderDate(order.timestamp)}</small>
                                </div>
                                <span className="badge bg-yellow">{order.status || 'New'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', border: '1px solid var(--border)', background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
                                    {order.image && !imageErrors.has(order.id) ? (
                                        <img src={order.image} alt={order.productTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => onImageError(order.id)} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                                            <span className="material-icons-round" style={{ fontSize: '32px', color: '#9ca3af' }}>checkroom</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 600 }}>{order.productTitle || '—'}</h4>
                                    <p style={{ fontWeight: 700, color: 'var(--primary)' }}>PKR {order.price || '—'}</p>
                                </div>
                            </div>
                            <div className="action-btns">
                                <button className="btn-sm" onClick={() => setShowSizeModal(true)}>Size Chart</button>
                                <button className="btn-sm" onClick={() => navigate('/tailor/messages')}>Chat</button>
                                <button className="btn-sm btn-primary">Track Order</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Size Chart Modal */}
            {showSizeModal && (
                <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setShowSizeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Size Measurements</h3>
                            <button onClick={() => setShowSizeModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '12px' }}>
                                <small style={{ color: 'gray' }}>Chest</small>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>40 inches</div>
                            </div>
                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '12px' }}>
                                <small style={{ color: 'gray' }}>Waist</small>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>34 inches</div>
                            </div>
                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '12px' }}>
                                <small style={{ color: 'gray' }}>Shoulder</small>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>18 inches</div>
                            </div>
                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '12px' }}>
                                <small style={{ color: 'gray' }}>Length</small>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>42 inches</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default OrdersPage;
