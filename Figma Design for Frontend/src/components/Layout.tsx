import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
    children: ReactNode;
    onNavigateToCart?: () => void;
    onNavigateToChat?: () => void;
    onNavigateToDiscovery?: () => void;
    onNavigateToSignUp?: () => void;
}

export default function Layout({
    children,
    onNavigateToCart,
    onNavigateToChat,
    onNavigateToDiscovery,
    onNavigateToSignUp
}: LayoutProps) {
    const location = useLocation();
    const isMeasurement = location.pathname === '/measurement';
    const isProfile = location.pathname === '/profile';
    const isMessages = location.pathname === '/messages';
    const { isFirebaseConnected } = useAuth();
    const showFooter = !isMeasurement && !isProfile && !isMessages;

    return (
        <div className="flex flex-col min-h-screen w-full bg-white">
            {/* Header hamesha top pe, sticky + high z-index taake kabhi hide na ho */}
            <div className="sticky top-0 z-[100] shrink-0 w-full">
                <Header
                    onNavigateToCart={onNavigateToCart}
                    onNavigateToChat={onNavigateToChat}
                    onNavigateToDiscovery={onNavigateToDiscovery}
                />
            </div>
            <main className={`flex-grow w-full relative z-0 ${isMessages ? 'flex flex-col min-h-0' : ''}`}>
                {children}
            </main>
            {showFooter && (
                <Footer
                    onNavigateToSignUp={onNavigateToSignUp}
                    isFirebaseConnected={isFirebaseConnected}
                />
            )}
        </div>
    );
}
