import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { listenForOrders } from '../index';

/**
 * Hook: live tailor orders. Alert only when NEW order arrives (count increases).
 */
export function useTailorOrders() {
    const [orders, setOrders] = useState([]);
    const [newOrderAlert, setNewOrderAlert] = useState(false);
    const prevCountRef = useRef(-1);

    useEffect(() => {
        const unsubscribe = listenForOrders((ordersList) => {
            const list = ordersList || [];
            const newCount = list.length;
            setOrders(list);
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

/** Alert banner: "Order aya he" */
export function TailorOrderAlert({ count, lastOrder }) {
    return (
        <Link to="/tailor/orders" style={{ textDecoration: 'none' }}>
            <div
                style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
                    color: 'white',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
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

/** Orders card for tailor dashboard */
export function TailorOrdersCard({ count }) {
    return (
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#10B981' }}>
                        <span className="material-icons-round">shopping_cart</span>
                    </div>
                    <div>
                        <span className="stat-label">Total Orders</span>
                        <div className="stat-value" style={{ marginTop: '2px' }}>{count}</div>
                    </div>
                </div>
            </div>
            <Link to="/tailor/orders" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-icons-round" style={{ fontSize: '16px' }}>visibility</span>
                View orders
            </Link>
        </div>
    );
}

const FrontTailor = () => {
    const { count, newOrderAlert, lastOrder } = useTailorOrders();
    return (
        <>
            {newOrderAlert && count > 0 && <TailorOrderAlert count={count} lastOrder={lastOrder} />}
            <TailorOrdersCard count={count} />
        </>
    );
};

export default FrontTailor;
