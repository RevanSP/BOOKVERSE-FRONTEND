import React from 'react';

interface LoaderProps {
    fadeOut: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fadeOut }) => {
    return (
        <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
