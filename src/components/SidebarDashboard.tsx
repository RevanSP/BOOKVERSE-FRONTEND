import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarDashboardProps } from '../types';

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({ children }) => {
    return (
        <div className="drawer min-h-screen flex flex-col">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col flex-grow">
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-100 min-h-full w-80 p-4">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/manga-tab">Manga Tab</Link></li>
                    <li><Link to="/manhua-tab">Manhua Tab</Link></li>
                    <li><Link to="/manhwa-tab">Manhwa Tab</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default SidebarDashboard;
