import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';
import { listenForOrders } from './sellerdatabase';
import { INITIAL_PRODUCTS } from './SellerProducts';

/** Format order timestamp to date string */
function formatOrderDate(timestamp) {
    if (!timestamp) return '—';
    const ms = timestamp?.toMillis?.() ?? (timestamp instanceof Date ? timestamp.getTime() : timestamp);
    const d = new Date(ms);
    return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

const SellerIncome = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [orders, setOrders] = useState([]);

    const switchTab = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        const headings = ['My Income', 'Overview', 'Order History', 'Recent Orders'];
        saveHeadings('SellerIncome', headings).catch(() => {});
    }, []);

    useEffect(() => {
        const unsubscribe = listenForOrders((ordersList) => {
            setOrders(ordersList || []);
        });
        return () => unsubscribe();
    }, []);

    // Newest first for display
    const sortedOrders = [...orders].sort((a, b) => {
        const t = (o) => o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
        return t(b) - t(a);
    });

    const getOrderMs = (o) => o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
    const parsePrice = (o) => parseFloat(String(o.price || 0).replace(/,/g, '')) || 0;

    // Total Income = sab orders ki price ka sum (kitne order chale gaye)
    const totalIncomeAvailable = orders.reduce((sum, o) => sum + parsePrice(o), 0);
    const totalOrdersCount = orders.length;

    // Pending Income = sirf un orders ka sum jinka product Products page par Pending hai (orderId in pending list)
    const pendingProductIds = (INITIAL_PRODUCTS.pending || []).map((p) => p.id);
    const pendingOrders = orders.filter((o) => pendingProductIds.includes(o.orderId || o.productId || ''));
    const pendingIncome = pendingOrders.reduce((sum, o) => sum + parsePrice(o), 0);
    const pendingOrdersCount = pendingOrders.length;

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>My Income</div>
                </div>
            </header>

            {/* Tabs Header */}
            <div className="seller-tabs-container" style={{ background: 'white', padding: '0 1rem' }}>
                <div className="seller-tabs-header" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                    <button className={`seller-tab-btn ${activeTab === 0 ? 'active' : ''}`}
                        onClick={() => switchTab(0)}
                        style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', fontWeight: 700, color: activeTab === 0 ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                        Overview
                        {activeTab === 0 && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '3px 3px 0 0' }}></div>}
                    </button>
                    <button className={`seller-tab-btn ${activeTab === 1 ? 'active' : ''}`}
                        onClick={() => switchTab(1)}
                        style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', fontWeight: 700, color: activeTab === 1 ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                        Order History
                        {activeTab === 1 && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '3px 3px 0 0' }}></div>}
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {activeTab === 0 ? (
                    <div className="seller-tab-pane active">
                        {/* Earnings Card – user orders ke hisaab se */}
                        <div className="seller-summary-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Total Income Available</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>Rs. {totalIncomeAvailable.toLocaleString()}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{totalOrdersCount} order{totalOrdersCount !== 1 ? 's' : ''} chale</div>
                                </div>
                                <span className="material-icons-round" style={{ fontSize: '40px', color: 'rgba(99, 102, 241, 0.2)' }}>account_balance_wallet</span>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Pending Income</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'orange' }}>Rs. {pendingIncome.toLocaleString()}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{pendingOrdersCount} order{pendingOrdersCount !== 1 ? 's' : ''} from Pending products</div>
                                </div>
                                <span className="material-icons-round" style={{ fontSize: '40px', color: 'rgba(255, 165, 0, 0.2)' }}>pending_actions</span>
                            </div>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Recent Orders</div>

                        {/* Live orders – jitna user ne order kiya utna yahan dikhega */}
                        {sortedOrders.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Abhi koi order nahi aya. User /order se order karega to yahan dikhega.
                            </div>
                        ) : (
                            sortedOrders.slice(0, 5).map((order) => (
                                <div key={order.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid var(--border)', padding: '8px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                                        <span className="material-icons-round">shopping_bag</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 700, display: 'block', marginBottom: '2px' }}>{order.productTitle || `Order #${order.orderId || order.id}`}</span>
                                        <span style={{ fontWeight: 500 }}>PKR {order.price || '—'}</span>
                                    </div>
                                    <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}>
                                        New
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="seller-tab-pane active">
                        <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Order History</div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Jitne bhi orders user ne /order se place kiye, woh yahan dikhte hain – order ka naam aur amount.</p>

                        {/* Live Order History – Firebase se */}
                        {sortedOrders.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '10px', padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}>
                                Abhi koi order nahi. User <strong>/order</strong> page se order karega to yahan list mein aa jayega.
                            </div>
                        ) : (
                            sortedOrders.map((order) => (
                                <div key={order.id} style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}>
                                        <span className="material-icons-round" style={{ fontSize: '20px' }}>shopping_bag</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700 }}>{order.productTitle || `Order #${order.orderId || order.id}`}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {formatOrderDate(order.timestamp)} • Order ID: {order.orderId || order.id}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--primary)' }}>PKR {order.price || '—'}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerIncome;
