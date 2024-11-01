import React from 'react';
import { ButtonManhwaADDProps } from '../types';

const ButtonManhwaADD: React.FC<ButtonManhwaADDProps> = ({ dialogId }) => {
  const handleClick = () => {
    const dialog = document.getElementById(dialogId) as HTMLDialogElement;
    dialog?.showModal();
  };

  return (
    <button
      className="btn btn-sm border-2 border-neutral-content rounded btn-base-200"
      onClick={handleClick}
    >
      <i className="fa-solid fa-plus"></i>
    </button>
  );
};

export default ButtonManhwaADD;
