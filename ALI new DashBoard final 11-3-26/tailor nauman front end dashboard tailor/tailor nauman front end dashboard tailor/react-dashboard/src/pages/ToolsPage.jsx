import React from 'react';

const ToolsPage = () => {
    return (
        <div className="tool-grid">
            <div className="tool-card" onClick={() => alert('Manage Inventory')}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Inventory</h3>
                <p style={{ color: 'gray', fontSize: '0.9rem' }}>Manage fabrics & stock</p>
            </div>
            <div className="tool-card" onClick={() => alert('Manage Campaigns')}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📢</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Campaigns</h3>
                <p style={{ color: 'gray', fontSize: '0.9rem' }}>Run promotions</p>
            </div>
        </div>
    );
};

export default ToolsPage;
