import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ShopEntry from './ShopEntry';
import TailorEntry from './modules/TailorDiscovery/TailorEntry';
import MeasurementEntry from './modules/Measurement/MeasurementEntry';
import ChatPageWrapper from './components/ChatPageWrapper';
import AllMessagesPage from './components/AllMessagesPage';
import Product from './modules/Product/Product';
import Login from './imports/Login-6-7925';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AppErrorBoundary from './components/AppErrorBoundary';

function TailorLoginPage() {
  const navigate = useNavigate();
  return (
    <Login
      title="Tailor Login"
      subtitle="Sign in as a tailor to manage your profile and orders."
      onNavigateToSignUp={() => navigate('/signup')}
      onNavigateToLanding={() => navigate('/')}
      onLoginSuccess={() => navigate('/')}
    />
  );
}

function LoginRoute() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <ShopEntry initialPage="profile" />;
    return <ShopEntry initialPage="login" />;
}

export default function App() {
    return (
        <AppErrorBoundary>
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<ShopEntry />} />
                            <Route path="/discovery" element={<TailorEntry />} />
                            <Route path="/measurement" element={<MeasurementEntry />} />
                            <Route path="/chat-with-tailor" element={<ChatPageWrapper onNavigateBack={() => window.history.back()} />} />
                            <Route path="/messages" element={<AllMessagesPage />} />
                            <Route path="/product" element={<Product />} />

                            <Route path="/profile" element={<ShopEntry initialPage="profile" />} />
                            <Route path="/login" element={<LoginRoute />} />
                            <Route path="/tailor-login" element={<TailorLoginPage />} />
                            <Route path="/signup" element={<ShopEntry initialPage="signup" />} />
                            <Route path="/cart" element={<ShopEntry initialPage="cart" />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
        </AppErrorBoundary>
    );
}
