import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import '../../SellerDashboard.css';

const SellerLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userRole');
            navigate('/');
        }
    };

    return (
        <div className="seller-container">
            {/* Sidebar (Desktop) */}
            <aside className="seller-sidebar">
                <div className="seller-brand">
                    <div className="seller-brand-logo">SS</div>
                    <div className="seller-brand-name">SmartSeller</div>
                </div>
                <nav className="seller-nav-items">
                    <NavLink to="/seller" end className={({ isActive }) => isActive ? "seller-nav-item active" : "seller-nav-item"}>
                        <span className="material-icons-round">home</span>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/seller/products" className={({ isActive }) => isActive ? "seller-nav-item active" : "seller-nav-item"}>
                        <span className="material-icons-round">shopping_bag</span>
                        <span>Products</span>
                    </NavLink>
                    <NavLink to="/seller/income" className={({ isActive }) => isActive ? "seller-nav-item active" : "seller-nav-item"}>
                        <span className="material-icons-round">account_balance_wallet</span>
                        <span>Income</span>
                    </NavLink>
                    <NavLink to="/seller/messages" className={({ isActive }) => isActive ? "seller-nav-item active" : "seller-nav-item"}>
                        <span className="material-icons-round">message</span>
                        <span>Messages</span>
                    </NavLink>
                    <NavLink to="/seller/tools" className={({ isActive }) => isActive ? "seller-nav-item active" : "seller-nav-item"}>
                        <span className="material-icons-round">grid_view</span>
                        <span>Tools</span>
                    </NavLink>
                    <NavLink to="/seller/profile" className={({ isActive }) => isActive ? "seller-nav-item active" : "seller-nav-item"}>
                        <span className="material-icons-round">person</span>
                        <span>Profile</span>
                    </NavLink>
                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <button onClick={handleLogout} className="seller-nav-item" style={{ color: '#ef4444', background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                            <span className="material-icons-round">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="seller-main-content">
                <Outlet />
            </main>

            {/* Bottom Nav (Mobile) */}
            <nav className="seller-bottom-nav">
                <NavLink to="/seller" end className={({ isActive }) => isActive ? "seller-bottom-nav-item active" : "seller-bottom-nav-item"}>
                    <span className="material-icons-round">home</span>
                    <span>Home</span>
                </NavLink>
                <NavLink to="/seller/products" className={({ isActive }) => isActive ? "seller-bottom-nav-item active" : "seller-bottom-nav-item"}>
                    <span className="material-icons-round">shopping_bag</span>
                    <span>Products</span>
                </NavLink>
                <NavLink to="/seller/income" className={({ isActive }) => isActive ? "seller-bottom-nav-item active" : "seller-bottom-nav-item"}>
                    <span className="material-icons-round">account_balance_wallet</span>
                    <span>Income</span>
                </NavLink>
                <NavLink to="/seller/messages" className={({ isActive }) => isActive ? "seller-bottom-nav-item active" : "seller-bottom-nav-item"}>
                    <span className="material-icons-round">message</span>
                    <span>Messages</span>
                </NavLink>
                <NavLink to="/seller/tools" className={({ isActive }) => isActive ? "seller-bottom-nav-item active" : "seller-bottom-nav-item"}>
                    <span className="material-icons-round">grid_view</span>
                    <span>Tools</span>
                </NavLink>
                <NavLink to="/seller/profile" className={({ isActive }) => isActive ? "seller-bottom-nav-item active" : "seller-bottom-nav-item"}>
                    <span className="material-icons-round">person</span>
                    <span>Profile</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default SellerLayout;
