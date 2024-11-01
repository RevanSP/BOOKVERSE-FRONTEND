import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useAuth(); 
    const userEmail = localStorage.getItem('userEmail');

    const allowedEmails = [
        import.meta.env.VITE_DEV_EMAIL,
        import.meta.env.VITE_GUEST_EMAIL
    ];

    if (isAuthenticated || allowedEmails.includes(userEmail || '')) {
        if (role && allowedRoles.includes(role)) {
            return <>{children}</>; 
        }
    }

    return <Navigate to="/" replace />; 
};

export default ProtectedRoute;
