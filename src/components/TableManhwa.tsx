import React from 'react';
import { TableManhwaProps } from '../types';

const TableManhwa: React.FC<TableManhwaProps> = ({
    currentManhwa,
    selectedManhwa,
    handleSelectAll,
    handleSelectManhwa,
    handleDeleteManhwa,
    openEditModal,
    userEmail,
    indexOfFirstManhwa,
}) => {
    return (
        <table className="table table-xs table-zebra">
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            onChange={handleSelectAll}
                            checked={currentManhwa.length > 0 && currentManhwa.every(manhwa => selectedManhwa.has(manhwa.title))}
                        />
                    </th>
                    <th>NO</th>
                    <th>TITLE</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                {currentManhwa.length > 0 ? (
                    currentManhwa.map((manhwa, index) => (
                        <tr key={manhwa.title}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={selectedManhwa.has(manhwa.title)}
                                    onChange={() => handleSelectManhwa(manhwa.title)}
                                />
                            </td>
                            <td className="text-xs font-bold">{index + 1 + indexOfFirstManhwa}</td>
                            <td className="text-xs font-bold truncate">{manhwa.title}</td>
                            <td>
                                <div className="flex space-x-2">
                                    <button
                                        className="btn btn-xs border-2 border-neutral-content rounded btn-base-200"
                                        onClick={() => openEditModal(manhwa)}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteManhwa(manhwa.title)}
                                        disabled={userEmail !== 'revanspstudy28@gmail.com'}
                                        className="btn btn-xs border-2 border-neutral-content rounded btn-base-200"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="text-center">
                            <div role="alert" className="alert border-2 border-neutral-content alert-primary rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>No Manhwa found</span>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <th>NO</th>
                    <th>TITLE</th>
                    <th>ACTION</th>
                </tr>
            </tfoot>
        </table>
    );
};

export default TableManhwa;
