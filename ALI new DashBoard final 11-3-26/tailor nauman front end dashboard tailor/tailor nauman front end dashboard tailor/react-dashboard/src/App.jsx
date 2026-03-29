import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import OrdersPage from './pages/OrdersPage';
import ReviewsPage from './pages/ReviewsPage';
import IncomePage from './pages/IncomePage';
import MessagesPage from './pages/MessagesPage';
import ToolsPage from './pages/ToolsPage';
import ProfilePage from './pages/ProfilePage';
import RoleSelection from './pages/auth/RoleSelection';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyCode from './pages/auth/VerifyCode';
import './App.css';
import './Auth.css';

// Seller Components
import SellerLayout from './components/seller/SellerLayout';
import SellerHome from './pages/seller fire base/SellerHome';
import SellerProducts from './pages/seller fire base/SellerProducts';
import SellerIncome from './pages/seller fire base/SellerIncome';
import SellerMessages from './pages/seller fire base/SellerMessages';
import SellerTools from './pages/seller fire base/SellerTools';
import SellerProfile from './pages/seller fire base/SellerProfile';
import SellerAccount from './pages/seller fire base/SellerAccount';
import BankAccount from './pages/seller fire base/BankAccount';
import BusinessAccount from './pages/seller fire base/BusinessAccount';
import UserChat from './pages/seller fire base/UserChat';
import SellerReviews from './pages/seller fire base/SellerReviews';
import SellerAddProduct from './pages/seller fire base/SellerAddProduct';
import UserShop from './pages/UserShop';
import UserOrderPage from './pages/seller fire base/sellerdatabase/frontseller/UserOrderPage';
import TailorOrderPage from './pages/tailor firebase/fronttailor/TailorOrderPage';

function App() {
    console.log('App render')
    return (
        <Routes>
            {/* Auth Flow */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerifyCode />} />

            {/* User Shop – user yahan product par Order click karta hai, seller ko dashboard par dikhta hai */}
            <Route path="/shop" element={<UserShop />} />
            {/* Alag order page – FrontSeller style; user order kare to Seller Dashboard par show hota hai */}
            <Route path="/order" element={<UserOrderPage />} />
            {/* Tailor order page – user order kare to Tailor Dashboard par "order aya he" dikhega */}
            <Route path="/tailor-order" element={<TailorOrderPage />} />

            {/* Tailor Dashboard Layout */}
            <Route path="/tailor/*" element={
                <>
                    <Sidebar />
                    <div className="main-wrapper">
                        <Header />
                        <main className="content-body">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="analytics" element={<AnalyticsPage />} />
                                <Route path="orders" element={<OrdersPage />} />
                                <Route path="reviews" element={<ReviewsPage />} />
                                <Route path="income" element={<IncomePage />} />
                                <Route path="messages" element={<MessagesPage />} />
                                <Route path="tools" element={<ToolsPage />} />
                                <Route path="profile" element={<ProfilePage />} />
                            </Routes>
                        </main>
                    </div>
                </>
            } />

            {/* Seller Dashboard Routes */}
            <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerHome />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="income" element={<SellerIncome />} />
                <Route path="messages" element={<SellerMessages />} />
                <Route path="tools" element={<SellerTools />} />
                <Route path="profile" element={<SellerProfile />} />
                <Route path="profile/seller-account" element={<SellerAccount />} />
                <Route path="profile/bank-account" element={<BankAccount />} />
                <Route path="profile/business-account" element={<BusinessAccount />} />
                <Route path="chat" element={<UserChat />} />
                <Route path="reviews" element={<SellerReviews />} />
                <Route path="add-product" element={<SellerAddProduct />} />
            </Route>
        </Routes>
    );
}

export default App;
