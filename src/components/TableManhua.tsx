import React from 'react';
import { TableManhuaProps } from '../types';

const TableManhua: React.FC<TableManhuaProps> = ({
    currentManhua,
    selectedManhua,
    handleSelectAll,
    handleSelectManhua,
    openEditModal,
    handleDeleteManhua,
    userEmail,
    indexOfFirstManhua,
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
                            checked={currentManhua.length > 0 && currentManhua.every(manhua => selectedManhua.has(manhua.title))}
                        />
                    </th>
                    <th>NO</th>
                    <th>TITLE</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                {currentManhua.length > 0 ? (
                    currentManhua.map((manhua, index) => (
                        <tr key={manhua.title}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={selectedManhua.has(manhua.title)}
                                    onChange={() => handleSelectManhua(manhua.title)}
                                />
                            </td>
                            <td className="text-xs font-bold">{index + 1 + indexOfFirstManhua}</td>
                            <td className="text-xs font-bold truncate">{manhua.title}</td>
                            <td>
                                <div className="flex space-x-2">
                                    <button
                                        className="btn btn-xs border-2 border-neutral-content rounded btn-base-200"
                                        onClick={() => openEditModal(manhua)}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteManhua(manhua.title)}
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
                                <span>No Manhua found</span>
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

export default TableManhua;
