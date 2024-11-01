import React from 'react';
import { ButtonSelectedManhuaProps } from '../types';

const ButtonSelectedManhua: React.FC<ButtonSelectedManhuaProps> = ({
    handleDelete,
    userEmail,
    selectedManhuaSize,
}) => {
    const isDisabled = userEmail !== 'revanspstudy28@gmail.com' || selectedManhuaSize === 0;

    return (
        <button
            onClick={handleDelete}
            className={`btn btn-sm border-2 border-neutral-content rounded btn-base-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDisabled}
        >
            <i className="fa-solid fa-delete-left"></i>
        </button>
    );
};

export default ButtonSelectedManhua;
