import React from 'react';
import { PaginationTableManhwaProps } from '../types';

const PaginationTableManhwa: React.FC<PaginationTableManhwaProps> = ({ totalPages, currentPage, handlePageChange }) => {
    return (
        <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    className={`join-item btn btn-xs ${currentPage === index + 1 ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};

export default PaginationTableManhwa;