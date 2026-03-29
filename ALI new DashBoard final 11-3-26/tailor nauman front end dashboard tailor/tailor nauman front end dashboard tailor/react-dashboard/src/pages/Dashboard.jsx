import React, { useState, useEffect } from 'react';
import { useTailorOrders, TailorOrderAlert, TailorOrdersCard } from './tailor firebase/fronttailor';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// firebase imports
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

function orderTimeMs(order) {
    const t = order?.timestamp;
    if (!t) return 0;
    return t?.toMillis?.() ?? (t instanceof Date ? t.getTime() : (t?.seconds ? t.seconds * 1000 : 0));
}

function getOrdersByDay(orders, days) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const buckets = Array(days).fill(0).map((_, i) => ({ sales: 0, count: 0 }));
    orders.forEach((o) => {
        const ms = orderTimeMs(o);
        const dayIndex = Math.floor((now - ms) / dayMs);
        if (dayIndex >= 0 && dayIndex < days) {
            buckets[days - 1 - dayIndex].sales += Number(o.price) || 0;
            buckets[days - 1 - dayIndex].count += 1;
        }
    });
    return buckets;
}

function formatNum(n) {
    return n.toLocaleString();
}

const Dashboard = () => {
    const [period, setPeriod] = useState('Week 1');
    const { orders, count, newOrderAlert, lastOrder } = useTailorOrders();

    // Real stats from tailor orders
    const totalIncome = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const totalSales = count;
    const ordersPaid = count;
    const totalVisitor = Math.max(count * 2, count + 100); // proxy: visitors scale with orders

    // % change: last 7 days vs previous 7 days
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const last7 = orders.filter((o) => (now - orderTimeMs(o)) <= 7 * dayMs).length;
    const prev7 = orders.filter((o) => {
        const ms = orderTimeMs(o);
        return ms > (now - 14 * dayMs) && ms <= (now - 7 * dayMs);
    }).length;
    const changePct = prev7 > 0 ? (((last7 - prev7) / prev7) * 100).toFixed(2) : (last7 > 0 ? '100' : '0');
    const changeStr = last7 >= prev7 ? `+${changePct}%` : `${changePct}%`;

    // Sparkline: last 10 days daily income (or count) for trend
    const last10Days = getOrdersByDay(orders, 10);
    const sparkSales = last10Days.map((d) => d.count);
    const sparkIncome = last10Days.map((d) => d.sales);
    const sparkOrders = last10Days.map((d) => d.count);
    const sparkVisitor = last10Days.map((d) => Math.max(d.count * 2, d.count + 5));

    // Optional: send analytics to Firestore when period changes
    useEffect(() => {
        const saveAnalytics = async () => {
            try {
                await addDoc(collection(db, 'analytics'), {
                    period,
                    totalSales,
                    totalIncome,
                    ordersPaid,
                    totalVisitor,
                    timestamp: new Date()
                });
            } catch (err) {
                console.error('failed saving analytics', err);
            }
        };
        saveAnalytics();
    }, [period, totalSales, totalIncome, ordersPaid, totalVisitor]);

    // also try a one‑time write on mount to debug
    useEffect(() => {
        const testWrite = async () => {
            try {
                const r = await addDoc(collection(db, 'analytics_test'), { test: true, time: new Date() });
                console.log('test write ok', r.id);
            } catch (e) {
                console.error('test write failed', e);
            }
        };
        testWrite();
    }, []);


    const sparklineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false, min: 0 } },
        elements: { point: { radius: 0 }, line: { borderWidth: 2, tension: 0.4 } },
    };

    const createSparkData = (color, data) => ({
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{
            data: data,
            borderColor: color,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 60);
                gradient.addColorStop(0, color.replace('1)', '0.2)'));
                gradient.addColorStop(1, color.replace('1)', '0.0)'));
                return gradient;
            },
            fill: true,
        }]
    });

    // Sales vs Profit chart: real order data by period (Week 1 = 7 days, Week 3 = 21, 1 Month = 30)
    const periodDays = period === 'Week 1' ? 7 : period === 'Week 3' ? 21 : 30;
    const byDay = getOrdersByDay(orders, periodDays);
    const salesByDay = byDay.map((d) => d.sales);
    const profitByDay = byDay.map((d) => d.sales * 0.6);

    const salesData = {
        labels: salesByDay.map((_, i) => `Day ${i + 1}`),
        datasets: [
            {
                label: 'Sales (PKR)',
                data: salesByDay,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Profit (PKR)',
                data: profitByDay,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    return (
        <section className="view-section active">
            <div className="page-header">
                <div className="page-title">
                    <h1>Tailor Center Analytics</h1>
                    <p>Track your shop performance, sales, and profits.</p>
                </div>
            </div>

            {newOrderAlert && count > 0 && <TailorOrderAlert count={count} lastOrder={lastOrder} />}

            <div className="analytics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                <TailorOrdersCard count={count} />
                <div className="stat-card" style={{ position: 'relative', overflow: 'hidden', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span className="stat-label">Total Sales</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span className="stat-value">{formatNum(totalSales)}</span>
                            <span className="badge-status paid" style={{ fontSize: '0.75rem' }}>{changeStr}</span>
                        </div>
                    </div>
                    <div style={{ height: '60px', width: '100%', position: 'relative', marginTop: 'auto' }}>
                        <Line options={sparklineOptions} data={createSparkData('rgba(79, 70, 229, 1)', sparkSales.length ? sparkSales : [0])} />
                    </div>
                </div>

                <div className="stat-card" style={{ position: 'relative', overflow: 'hidden', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span className="stat-label">Total Income</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span className="stat-value">PKR {formatNum(totalIncome)}</span>
                            <span className="badge-status paid" style={{ fontSize: '0.75rem' }}>{changeStr}</span>
                        </div>
                    </div>
                    <div style={{ height: '60px', width: '100%', position: 'relative', marginTop: 'auto' }}>
                        <Line options={sparklineOptions} data={createSparkData('rgba(16, 185, 129, 1)', sparkIncome.length ? sparkIncome : [0])} />
                    </div>
                </div>

                <div className="stat-card" style={{ position: 'relative', overflow: 'hidden', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span className="stat-label">Orders Paid</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span className="stat-value">{formatNum(ordersPaid)}</span>
                            <span className="badge-status pending" style={{ background: '#F3F4F6', color: 'gray', fontSize: '0.75rem' }}>{ordersPaid ? changeStr : '0.00%'}</span>
                        </div>
                    </div>
                    <div style={{ height: '60px', width: '100%', position: 'relative', marginTop: 'auto' }}>
                        <Line options={sparklineOptions} data={createSparkData('rgba(107, 114, 128, 1)', sparkOrders.length ? sparkOrders : [0])} />
                    </div>
                </div>

                <div className="stat-card" style={{ position: 'relative', overflow: 'hidden', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span className="stat-label">Total Visitor</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span className="stat-value">{formatNum(totalVisitor)}</span>
                            <span className="badge-status paid" style={{ fontSize: '0.75rem' }}>{changeStr}</span>
                        </div>
                    </div>
                    <div style={{ height: '60px', width: '100%', position: 'relative', marginTop: 'auto' }}>
                        <Line options={sparklineOptions} data={createSparkData('rgba(245, 158, 11, 1)', sparkVisitor.length ? sparkVisitor : [0])} />
                    </div>
                </div>
            </div>

            <div className="chart-container" style={{ marginTop: '2rem' }}>
                <div className="chart-header">
                    <h3 className="chart-title">Sales vs Profit Report</h3>
                    <div className="period-selector">
                        {['Week 1', 'Week 3', '1 Month'].map(p => (
                            <button
                                key={p}
                                className={`period-btn ${period === p ? 'active' : ''}`}
                                onClick={() => setPeriod(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ height: '400px' }}>
                    <Line
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: { x: { display: false }, y: { display: false } },
                            plugins: { legend: { position: 'top' } }
                        }}
                        data={salesData}
                    />
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
