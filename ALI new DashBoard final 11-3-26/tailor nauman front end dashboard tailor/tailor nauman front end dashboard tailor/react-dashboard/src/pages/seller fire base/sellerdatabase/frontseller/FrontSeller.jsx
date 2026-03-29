import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { listenForOrders } from '../index';

/**
 * Hook: live orders for seller dashboard. Alert only when NEW order arrives (count increases).
 */
export function useSellerOrders() {
    const [orders, setOrders] = useState([]);
    const [newOrderAlert, setNewOrderAlert] = useState(false);
    const prevCountRef = useRef(-1);

    useEffect(() => {
        const unsubscribe = listenForOrders((ordersList) => {
            const list = ordersList || [];
            const newCount = list.length;
            setOrders(list);
            // Show alert only when count increased (new order just added), not on first load
            if (prevCountRef.current >= 0 && newCount > prevCountRef.current) {
                setNewOrderAlert(true);
            }
            prevCountRef.current = newCount;
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!newOrderAlert) return;
        const t = setTimeout(() => setNewOrderAlert(false), 6000);
        return () => clearTimeout(t);
    }, [newOrderAlert]);

    return { orders, count: orders.length, newOrderAlert, lastOrder: orders.length > 0 ? orders[orders.length - 1] : null };
}

/** Alert banner: "One order aya he" */
export function SellerOrderAlert({ count, lastOrder }) {
    return (
        <Link to="/seller/income" style={{ textDecoration: 'none' }}>
            <div
                style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    color: 'white',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                }}
            >
                <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.25)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                    <span className="material-icons-round" style={{ fontSize: '24px' }}>shopping_bag</span>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>
                        {count === 1 ? 'One order aya he' : `${count} orders aye hain`}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
                        {lastOrder?.orderId && `Order #${lastOrder.orderId}`}
                        {lastOrder?.productTitle && ` • ${lastOrder.productTitle}`}
                    </div>
                </div>
                <span className="material-icons-round" style={{ fontSize: '20px', opacity: 0.9 }}>arrow_forward</span>
            </div>
        </Link>
    );
}

/** Orders card with live count for dashboard grid */
export function SellerOrdersCard({ count }) {
    return (
        <div className="seller-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', display: 'grid', placeItems: 'center', color: 'var(--secondary)' }}>
                        <span className="material-icons-round">shopping_cart</span>
                    </div>
                    <div>
                        <div className="seller-stat-label">Total Orders</div>
                        <div className="seller-stat-value">{count}</div>
                    </div>
                </div>
            </div>
            <div style={{ height: '50px', margin: '10px -20px 0 -20px', opacity: 0.2 }}>
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path d="M0,30 L0,22 L15,18 L30,25 L45,15 L60,20 L75,10 L90,15 L100,10 L100,30 Z" fill="var(--secondary)" />
                    <path d="M0,22 L15,18 L30,25 L45,15 L60,20 L75,10 L90,15 L100,10" fill="none" stroke="var(--secondary)" strokeWidth="2" />
                </svg>
            </div>
            <Link to="/seller/income" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="seller-stat-trend seller-trend-up" style={{ marginTop: '8px', cursor: 'pointer' }}>
                    <span className="material-icons-round" style={{ fontSize: '16px' }}>visibility</span>
                    View orders
                </div>
            </Link>
        </div>
    );
}

/** Full front: alert + card. Use when you want both in one place. */
const FrontSeller = () => {
    const { count, newOrderAlert, lastOrder } = useSellerOrders();
    return (
        <>
            {newOrderAlert && count > 0 && <SellerOrderAlert count={count} lastOrder={lastOrder} />}
            <SellerOrdersCard count={count} />
        </>
    );
};

export default FrontSeller;
