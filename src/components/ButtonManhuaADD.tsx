import React from 'react';
import { ButtonManhuaADDProps } from '../types';

const ButtonManhuaADD: React.FC<ButtonManhuaADDProps> = ({ onClick }) => {
    return (
        <button
            className="btn btn-sm border-2 border-neutral-content rounded btn-base-200"
            onClick={onClick}
        >
            <i className="fa-solid fa-plus"></i>
        </button>
    );
};

export default ButtonManhuaADD;
