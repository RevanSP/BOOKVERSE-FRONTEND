/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return Boolean(localStorage.getItem('userEmail'));
    });

    const [role, setRole] = useState<string | null>(() => {
        return localStorage.getItem('userRole');
    });

    const login = (email: string, role: string) => {
        setIsAuthenticated(true);
        setRole(role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role); 
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');
        if (storedEmail && storedRole) {
            setIsAuthenticated(true);
            setRole(storedRole);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
