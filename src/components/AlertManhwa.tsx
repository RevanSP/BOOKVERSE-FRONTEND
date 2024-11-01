import React from 'react';

const AlertManhwa: React.FC = () => {
    return (
        <div className="col-span-3 sm:col-span-2 md:col-span-4 lg:col-span-8" role="alert">
            <div className="alert bg-base-300 border-2 border-neutral-content rounded">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No manhwa found matching your search or selected genre.</span>
            </div>
        </div>
    );
};

export default AlertManhwa;
