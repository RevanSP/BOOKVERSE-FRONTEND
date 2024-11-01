import React from 'react';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import SidebarDashboard from '../components/SidebarDashboard';
import NavbarDashboard from '../components/NavbarDashboard';

const Dashboard: React.FC = () => {

    return (
        <>
            <SidebarDashboard>
                <NavbarDashboard />
                <div className="flex-grow flex flex-col md:flex-row">
                    <Hero />
                </div>
                <Footer />
            </SidebarDashboard>
        </>
    );
};

export default Dashboard;
