import React, { useState, useEffect } from 'react';
import { listenForOrders } from './tailor firebase';

function orderTimeMs(order) {
    const t = order?.timestamp;
    if (!t) return 0;
    return t?.toMillis?.() ?? (t instanceof Date ? t.getTime() : (t?.seconds ? t.seconds * 1000 : 0));
}

function formatDate(order) {
    const ms = orderTimeMs(order);
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

const IncomePage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const unsub = listenForOrders((list) => setOrders(list || []));
        return () => unsub();
    }, []);

    const sortedOrders = [...orders].sort((a, b) => orderTimeMs(b) - orderTimeMs(a));

    const totalEarnings = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const pendingOrders = orders.filter((o) => (now - orderTimeMs(o)) <= 3 * dayMs);
    const pendingClearance = pendingOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const withdrawn = 0; // optional: can be stored in Firebase later
    const availableBalance = totalEarnings - withdrawn;

    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    const formatRs = (n) => 'Rs ' + (Number(n) || 0).toLocaleString();

    return (
        <section className="view-section active">
            <div className="page-header">
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => switchTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => switchTab('history')}
                    >
                        Order History
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div id="overview-section">
                    <div className="total-income-card">
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Available Balance
                        </p>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '0.5rem 0' }}>{formatRs(availableBalance)}</h2>
                        <button
                            style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}
                            onClick={() => alert('Withdraw to Bank')}
                        >
                            Withdraw to Bank
                        </button>
                    </div>

                    <div className="income-stats-grid">
                        <div className="income-mini-card">
                            <p className="stat-label">Total Earnings</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem' }}>{formatRs(totalEarnings)}</div>
                        </div>
                        <div className="income-mini-card">
                            <p className="stat-label">Withdrawn</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>{formatRs(withdrawn)}</div>
                        </div>
                        <div className="income-mini-card">
                            <p className="stat-label">Pending Clearance</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B', marginTop: '0.5rem' }}>{formatRs(pendingClearance)}</div>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Recent Transactions</h3>
                    <div className="table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Date</th>
                                    <th>Method</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>
                                            Abhi koi order nahi. Orders /tailor-order se aayenge, yahan dikhenge.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td><b>#{order.orderId || order.id}</b></td>
                                            <td>{formatDate(order)}</td>
                                            <td>Order</td>
                                            <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatRs(order.price)}</td>
                                            <td><span className="badge-status paid">{order.status || 'PAID'}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div id="history-section">
                    <div className="table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Order Info</th>
                                    <th>Participants</th>
                                    <th>Financials</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>
                                            Order History wohi hai jo orders aaye hain. Abhi koi order nahi.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    {order.image ? (
                                                        <img
                                                            src={order.image}
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                            alt={order.productTitle}
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '50px', height: '50px', background: '#e5e7eb', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                                                            <span className="material-icons-round" style={{ fontSize: '24px', color: '#9ca3af' }}>checkroom</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>{order.productTitle || '—'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'gray' }}>#{order.orderId || order.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>#{order.orderId || order.id}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'gray' }}>{formatDate(order)}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <span style={{ color: 'gray' }}>Customer</span> order
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{formatRs(order.price)}</div>
                                            </td>
                                            <td><span className="badge-status paid">{order.status || 'PAID'}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
};

export default IncomePage;
