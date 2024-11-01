import React from 'react';
import { LayoutProps } from '../types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="mx-auto p-4 container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
