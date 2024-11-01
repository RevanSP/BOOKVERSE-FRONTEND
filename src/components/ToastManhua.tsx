import React from 'react';
import { ToastManhuaProps } from '../types';

const ToastManhua: React.FC<ToastManhuaProps> = ({ message, visible }) => {
    return (
        <div className={`toast toast-center ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="alert alert-base-100 rounded border-2 border-neutral-content">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default ToastManhua;
