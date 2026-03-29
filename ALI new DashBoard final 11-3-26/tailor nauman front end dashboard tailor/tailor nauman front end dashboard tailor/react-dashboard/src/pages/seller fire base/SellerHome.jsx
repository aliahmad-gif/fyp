import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveSellerHomeSnapshot } from './sellerdatabase';
import { getCurrentUser } from '../../services/authFirebase';
import { useSellerOrders, SellerOrderAlert, SellerOrdersCard } from './sellerdatabase/frontseller';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getOrderDayKey(timestamp) {
    if (!timestamp) return null;
    const ms = timestamp?.toMillis?.() ?? (timestamp instanceof Date ? timestamp.getTime() : timestamp);
    const d = new Date(ms);
    return d.toDateString();
}

const SellerHome = () => {
    const { orders, count, newOrderAlert, lastOrder } = useSellerOrders();
    const productRevenue = orders.reduce((sum, o) => sum + (parseFloat(String(o.price || 0).replace(/,/g, '')) || 0), 0);

    // Last 7 days – har din ka revenue (orders ki price ka sum)
    const revenueByDay = React.useMemo(() => {
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            last7.push({ date: d, key: d.toDateString(), dayName: DAYS[d.getDay()], revenue: 0 });
        }
        orders.forEach((o) => {
            const key = getOrderDayKey(o.timestamp);
            if (!key) return;
            const row = last7.find((r) => r.key === key);
            if (row) row.revenue += parseFloat(String(o.price || 0).replace(/,/g, '')) || 0;
        });
        return last7;
    }, [orders]);

    const maxRevenue = Math.max(1, ...revenueByDay.map((d) => d.revenue));

    // Weekly (last 7 days) & Monthly (current month) revenue
    const weeklyRevenue = React.useMemo(() => {
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        return orders.reduce((sum, o) => {
            const ms = o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
            if (ms >= weekAgo) sum += parseFloat(String(o.price || 0).replace(/,/g, '')) || 0;
            return sum;
        }, 0);
    }, [orders]);

    const monthlyRevenue = React.useMemo(() => {
        const now = new Date();
        const y = now.getFullYear(), m = now.getMonth();
        return orders.reduce((sum, o) => {
            const ms = o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
            const d = new Date(ms);
            if (d.getFullYear() === y && d.getMonth() === m) sum += parseFloat(String(o.price || 0).replace(/,/g, '')) || 0;
            return sum;
        }, 0);
    }, [orders]);

    // Last 4 weeks – har week ka revenue (graph ke liye)
    const revenueByWeek = React.useMemo(() => {
        const weeks = [];
        const now = new Date();
        const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 3; i >= 0; i--) {
            const end = new Date(now);
            end.setDate(end.getDate() - i * 7);
            const start = new Date(end);
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            const label = `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]}`;
            weeks.push({ label, start: start.getTime(), end: end.getTime(), revenue: 0 });
        }
        orders.forEach((o) => {
            const ms = o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
            const w = weeks.find((x) => ms >= x.start && ms <= x.end);
            if (w) w.revenue += parseFloat(String(o.price || 0).replace(/,/g, '')) || 0;
        });
        return weeks;
    }, [orders]);

    // Last 6 months – har month ka revenue (graph ke liye)
    const revenueByMonth = React.useMemo(() => {
        const months = [];
        const now = new Date();
        const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
            const next = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
            months.push({ label, start: d.getTime(), end: next.getTime(), revenue: 0 });
        }
        orders.forEach((o) => {
            const ms = o?.timestamp?.toMillis?.() ?? (o?.timestamp instanceof Date ? o.timestamp.getTime() : 0);
            const m = months.find((x) => ms >= x.start && ms <= x.end);
            if (m) m.revenue += parseFloat(String(o.price || 0).replace(/,/g, '')) || 0;
        });
        return months;
    }, [orders]);

    const maxWeekly = Math.max(1, ...revenueByWeek.map((d) => d.revenue));
    const maxMonthly = Math.max(1, ...revenueByMonth.map((d) => d.revenue));

    useEffect(() => {
        saveSellerHomeSnapshot().catch((e) => console.error('failed saving seller headings', e));
    }, []);

    return (
        <div className="seller-page">
            <header className="seller-header">
                <div className="seller-header-left">
                    <h1 className="seller-page-title">Dashboard</h1>
                </div>
                <Link to="/seller/profile"
                    style={{ display: 'block', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <img src="https://ui-avatars.com/api/?name=Seller&background=0D8ABC&color=fff" alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Link>
            </header>

            {/* Business Advisor / Stats Section */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Business Advisor</h2>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Last 30 Days</span>
                </div>

                {newOrderAlert && count > 0 && <SellerOrderAlert count={count} lastOrder={lastOrder} />}

                <div className="seller-stats-grid">
                    {/* Card 1: Product Revenue – orders ki price ka total */}
                    <div className="seller-card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                                    <span className="material-icons-round">attach_money</span>
                                </div>
                                <div>
                                    <div className="seller-stat-label">Product Revenue</div>
                                    <div className="seller-stat-value">PKR {productRevenue.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '50px', margin: '10px -20px 0 -20px', opacity: 0.2 }}>
                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                                <path
                                    d="M0,30 L0,20 L10,15 L20,25 L30,10 L40,18 L50,12 L60,22 L70,5 L80,15 L90,8 L100,20 L100,30 Z"
                                    fill="var(--primary)"></path>
                                <path d="M0,20 L10,15 L20,25 L30,10 L40,18 L50,12 L60,22 L70,5 L80,15 L90,8 L100,20"
                                    fill="none" stroke="var(--primary)" strokeWidth="2"></path>
                            </svg>
                        </div>

                        <div className="seller-stat-trend seller-trend-up" style={{ marginTop: '8px' }}>
                            <span className="material-icons-round" style={{ fontSize: '16px' }}>trending_up</span>
                            {count} order{count !== 1 ? 's' : ''} se total
                        </div>
                    </div>

                    {/* Card 2: Orders – live from Firebase */}
                    <SellerOrdersCard count={count} />
                </div>
            </div>

            {/* Revenue Overview – last 7 days ka revenue (orders ki price) */}
            <div className="seller-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Revenue Overview</h2>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>● Revenue (PKR)</span>
                </div>

                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', padding: '10px 0' }}>
                    {revenueByDay.map((bar, i) => {
                        const pct = maxRevenue > 0 ? Math.round((bar.revenue / maxRevenue) * 100) : 0;
                        const height = pct < 8 && bar.revenue > 0 ? '8%' : `${Math.max(pct, 2)}%`;
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: '4px' }}>
                                <div title={`PKR ${bar.revenue.toLocaleString()}`} style={{ height, background: 'var(--primary)', borderRadius: '4px', minHeight: '4px' }}></div>
                                <div style={{ textAlign: 'center', fontSize: '10px', color: 'grey' }}>{bar.dayName}</div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Total: PKR {productRevenue.toLocaleString()}</span>
                    <span>Last 7 days</span>
                </div>

                {/* Weekly & Monthly Revenue – simple boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Weekly Revenue</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>PKR {weeklyRevenue.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Last 7 days</div>
                    </div>
                    <div style={{ background: 'rgba(236, 72, 153, 0.08)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Monthly Revenue</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>PKR {monthlyRevenue.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>This month</div>
                    </div>
                </div>
            </div>

            {/* Tools Section */}
            <div className="seller-section-title">Quick Actions</div>
            <div className="seller-tools-card">
                <Link to="/seller/add-product" className="seller-tool-item">
                    <div className="seller-icon-box-wrapper">
                        <div className="seller-icon-box seller-blue-bg">
                            <span className="material-icons-round" style={{ fontSize: '30px' }}>add_box</span>
                        </div>
                    </div>
                    <div className="seller-tool-label">Add Products</div>
                </Link>

                <Link to="/seller/products" className="seller-tool-item">
                    <div className="seller-icon-box-wrapper">
                        <div className="seller-icon-box seller-orange-deep-bg">
                            <span className="material-icons-round" style={{ fontSize: '30px' }}>inventory_2</span>
                        </div>
                    </div>
                    <div className="seller-tool-label">Products</div>
                </Link>

                <Link to="/seller/income" className="seller-tool-item">
                    <div className="seller-icon-box-wrapper">
                        <div className="seller-icon-box seller-purple-bg">
                            <span className="material-icons-round" style={{ fontSize: '30px' }}>receipt_long</span>
                        </div>
                    </div>
                    <div className="seller-tool-label">Orders</div>
                </Link>

                <Link to="/seller/income" className="seller-tool-item">
                    <div className="seller-icon-box-wrapper">
                        <div className="seller-icon-box seller-teal-bg">
                            <span className="material-icons-round" style={{ fontSize: '30px' }}>attach_money</span>
                        </div>
                    </div>
                    <div className="seller-tool-label">My Income</div>
                </Link>
            </div>
        </div>
    );
};

export default SellerHome;
