import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveHeadings } from '../../services/saveHeadings';

const SellerTools = () => {
    const navigate = useNavigate();

    const tools = [
        {
            title: 'Basic Function',
            items: [
                { path: '/seller/products', icon: 'inventory_2', label: 'Products', bgClass: 'seller-orange-deep-bg' },
                { path: '/seller/income', icon: 'receipt_long', label: 'Orders', bgClass: 'seller-purple-bg' },
                { path: '/seller/income', icon: 'attach_money', label: 'My Income', bgClass: 'seller-teal-bg' }
            ]
        },
        {
            title: 'Business upgrading',
            items: [
                { path: '/seller', icon: 'bar_chart', label: 'Business Advisor', bgClass: 'seller-blue-bg', isNew: true }
            ]
        }
    ];

    useEffect(() => {
        const headings = ['Advisors & Tools', ...tools.flatMap(s => [s.title, ...s.items.map(i => i.label)])];
        saveHeadings('SellerTools', headings).catch(() => {});
    }, []);

    return (
        <div className="seller-page" style={{ padding: 0 }}>
            <header className="seller-header" style={{ margin: 0 }}>
                <div className="seller-header-left">
                    <button className="seller-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="seller-page-title" style={{ marginLeft: '12px' }}>Advisors & Tools</div>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {tools.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '25px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>{section.title}</div>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
                            {section.items.map((item, itemIdx) => (
                                <Link key={itemIdx} to={item.path} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', marginBottom: '8px' }}>
                                        <div className={`seller-icon-box ${item.bgClass}`} style={{ width: '55px', height: '55px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                                            <span className="material-icons-round" style={{ fontSize: '30px' }}>{item.icon}</span>
                                        </div>
                                        {item.isNew && (
                                            <div style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 4px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                                                New
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(0, 0, 0, 0.87)', lineHeight: '1.2' }}>{item.label}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerTools;
