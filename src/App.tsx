import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DashboardManga from './pages/DashboardManga';
import DashboardManhua from './pages/DashboardManhua';
import DashboardManhwa from './pages/DashboardManhwa';
import ProtectedRoute from './ProtectedRoute';
import AOS from 'aos';
import Loader from './components/Loader';
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import 'aos/dist/aos.css';

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
        });

        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setLoading(false), 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && (
                <Loader fadeOut={fadeOut} />
            )}
            {!loading && (
                <AuthProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['DEVELOPER', 'GUEST']}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manga-tab"
                                element={
                                    <ProtectedRoute allowedRoles={['DEVELOPER', 'GUEST']}>
                                        <DashboardManga />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manhua-tab"
                                element={
                                    <ProtectedRoute allowedRoles={['DEVELOPER', 'GUEST']}>
                                        <DashboardManhua />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manhwa-tab"
                                element={
                                    <ProtectedRoute allowedRoles={['DEVELOPER', 'GUEST']}>
                                        <DashboardManhwa />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </AuthProvider>
            )}
        </>
    );
};

export default App;
