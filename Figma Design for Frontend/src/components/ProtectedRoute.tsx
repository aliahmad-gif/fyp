import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to home or login, but since ShopEntry handles login state, 
        // we can redirect to /login which we set up as a fallback route.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
