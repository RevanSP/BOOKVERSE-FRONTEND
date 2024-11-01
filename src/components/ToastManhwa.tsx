import React from 'react';
import { ToastManhwaProps } from '../types';

const ToastManhwa: React.FC<ToastManhwaProps> = ({ toastVisible, toastMessage }) => {
    return (
        <div className={`toast toast-center ${toastVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="alert alert-base-100 rounded border-2 border-neutral-content">
                <span>{toastMessage}</span>
            </div>
        </div>
    );
};

export default ToastManhwa;
