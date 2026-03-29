import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './landing3d/LandingPage3D';
import ProductPage from './modules/Product/Product';
import CartPage from './components/CartPage';

import ShippingPage from './components/ShippingPage';
import Login from './imports/Login-6-7925';
import PaymentPage from './components/PaymentPage';
import ThankYouPage from './components/ThankYouPage';
import ProfileWrapper from './components/ProfileWrapper';
import OrderListWrapper from './components/OrderListWrapper';
import TailorProgressWrapper from './components/TailorProgressWrapper';
import OrderDetailsWrapper from './components/OrderDetailsWrapper';
import ChatPageWrapper from './components/ChatPageWrapper';
import { CartProvider } from './components/CartContext';

import { useAuth } from './contexts/AuthContext';

// Simple page type for navigation - extended with string to support external routes conceptually in 'intendedDestination'
type Page = 'landing' | 'login' | 'signup' | 'cart' | 'shipping' | 'payment' | 'thankyou' | 'profile' | 'orders' | 'tailor-progress' | 'chat' | 'order-details' | 'product';

interface ShopEntryProps {
  initialPage?: Page;
}

export default function ShopEntry({ initialPage = 'landing' }: ShopEntryProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // State to track which page is currently displayed
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Sync state with prop changes (e.g. when navigating from / to /cart)
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Navigation functions – Sign In / Sign Up stay in app and show login/signup page
  const navigateToLanding = () => setCurrentPage('landing');
  const navigateToLogin = () => setCurrentPage('login');
  const navigateToSignUp = () => setCurrentPage('signup');
  const navigateToCart = () => setCurrentPage('cart');
  const navigateToShipping = () => setCurrentPage('shipping');
  const navigateToPayment = () => setCurrentPage('payment');
  const navigateToThankYou = () => setCurrentPage('thankyou');
  const navigateToProduct = () => setCurrentPage('product');

  const navigateToProfile = () => {
    if (isAuthenticated) {
      setCurrentPage('profile');
    } else {
      setCurrentPage('profile'); // still show profile page; user can sign in via header
    }
  };

  // Find a tailor button opens Tailor Discovery and Profile Pages (localhost:5176)
  const TAILOR_DISCOVERY_PAGE_URL = 'http://localhost:5176/';
  const navigateToDiscovery = () => window.open(TAILOR_DISCOVERY_PAGE_URL, '_blank');
  const navigateToTailorLogin = () => navigate('/tailor-login');

  const navigateToMeasurement = () => navigate('/measurement');

  const navigateToOrders = () => setCurrentPage('orders');

  const navigateToOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentPage('order-details');
  };

  const navigateToTailorProgress = () => setCurrentPage('tailor-progress');

  const navigateToChat = () => setCurrentPage('chat');

  const handleLogout = async () => {
    await logout();
    setCurrentPage('landing');
  };

  // Placeholder navigation functions for profile sidebar
  const navigateToMeasurements = () => {
    // TODO: Implement measurements page
    console.log('Navigate to measurements');
  };

  const navigateToAddress = () => {
    // TODO: Implement address page
    console.log('Navigate to address');
  };

  const navigateToPaymentMethods = () => {
    // TODO: Implement payment methods page
    console.log('Navigate to payment methods');
  };

  const navigateToReturns = () => {
    // TODO: Implement returns page
    console.log('Navigate to returns');
  };

  const navigateToReviews = () => {
    // TODO: Implement reviews page
    console.log('Navigate to reviews');
  };

  const navigateToCancellations = () => {
    // TODO: Implement cancellations page
    console.log('Navigate to cancellations');
  };

  const navigateToTailorReviews = () => {
    // TODO: Implement tailor reviews page
    console.log('Navigate to tailor reviews');
  };

  // Render the appropriate page based on current state
  return (
    <div className="size-full">
      {currentPage === 'login' && (
        <Login
          title="Sign in as a user"
          subtitle="Welcome back! Please enter your details."
          onNavigateToSignUp={navigateToSignUp}
          onNavigateToLanding={navigateToLanding}
          onLoginSuccess={navigateToLanding}
        />
      )}
      {currentPage === 'landing' && (
        <LandingPage
          onNavigateToSignUp={navigateToSignUp}
          onNavigateToLogin={navigateToLogin}
          onNavigateToCart={navigateToCart}
          onNavigateToChat={navigateToChat}
          onNavigateToDiscovery={navigateToDiscovery}
          onNavigateToMeasurement={navigateToMeasurement}
          onNavigateToTailorLogin={navigateToTailorLogin}
          onNavigateToProduct={navigateToProduct}
        />
      )}
      {currentPage === 'cart' && (
        <CartPage
          onNavigateToLanding={navigateToLanding}
          onNavigateToShipping={navigateToShipping}
          onNavigateToProfile={navigateToProfile}
        />
      )}
      {currentPage === 'shipping' && (
        <ShippingPage
          onNavigateToCart={navigateToCart}
          onNavigateToPayment={navigateToPayment}
          onNavigateToLanding={navigateToLanding}
          onNavigateToProfile={navigateToProfile}
        />
      )}
      {currentPage === 'payment' && (
        <PaymentPage
          onNavigateToShipping={navigateToShipping}
          onNavigateToThankYou={navigateToThankYou}
          onNavigateToLanding={navigateToLanding}
          onNavigateToProfile={navigateToProfile}
        />
      )}
      {currentPage === 'thankyou' && (
        <ThankYouPage
          onNavigateToLanding={navigateToLanding}
          onNavigateToOrders={navigateToOrders}
          onNavigateToProfile={navigateToProfile}
        />
      )}
      {currentPage === 'profile' && (
        <ProfileWrapper
          onNavigateToOrders={navigateToOrders}
          onNavigateToMeasurements={navigateToMeasurements}
          onNavigateToAddress={navigateToAddress}
          onNavigateToPaymentMethods={navigateToPaymentMethods}
          onNavigateToReturns={navigateToReturns}
          onNavigateToReviews={navigateToReviews}
          onNavigateToCancellations={navigateToCancellations}
          onNavigateToTailorProgress={navigateToTailorProgress}
          onNavigateToTailorReviews={navigateToTailorReviews}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'orders' && (
        <OrderListWrapper
          onNavigateToTailorProgress={navigateToTailorProgress}
          onNavigateToProfile={navigateToProfile}
          onNavigateToMeasurements={navigateToMeasurements}
          onNavigateToAddress={navigateToAddress}
          onNavigateToPaymentMethods={navigateToPaymentMethods}
          onNavigateToReturns={navigateToReturns}
          onNavigateToReviews={navigateToReviews}
          onNavigateToCancellations={navigateToCancellations}
          onNavigateToTailorReviews={navigateToTailorReviews}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'tailor-progress' && (
        <TailorProgressWrapper
          onNavigateToOrderList={navigateToOrders}
          onNavigateToProfile={navigateToProfile}
          onNavigateToMeasurements={navigateToMeasurements}
          onNavigateToAddress={navigateToAddress}
          onNavigateToPaymentMethods={navigateToPaymentMethods}
          onNavigateToReturns={navigateToReturns}
          onNavigateToReviews={navigateToReviews}
          onNavigateToCancellations={navigateToCancellations}
          onNavigateToTailorReviews={navigateToTailorReviews}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'order-details' && (
        <OrderDetailsWrapper
          orderId={selectedOrderId}
          onNavigateToOrders={navigateToOrders}
          onNavigateToProfile={navigateToProfile}
          onNavigateToMeasurements={navigateToMeasurements}
          onNavigateToAddress={navigateToAddress}
          onNavigateToPaymentMethods={navigateToPaymentMethods}
          onNavigateToReturns={navigateToReturns}
          onNavigateToReviews={navigateToReviews}
          onNavigateToCancellations={navigateToCancellations}
          onNavigateToTailorProgress={navigateToTailorProgress}
          onNavigateToTailorReviews={navigateToTailorReviews}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'chat' && (
        <div className="size-full">
          <ChatPageWrapper
            onNavigateBack={navigateToLanding}
          />
        </div>
      )}
      {currentPage === 'product' && (
        <div className="size-full overflow-auto">
          <ProductPage />
        </div>
      )}
    </div>
  );
}