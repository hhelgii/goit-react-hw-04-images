import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import css from './modal.module.css';

export const Modal = ({ pic, onCloseModal }) => {
  const handleOverlayClick = event => {
    if (event.currentTarget === event.target) {
      onCloseModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal}>
        <img src={pic} alt="" className={css.modalImage} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  pic: propTypes.string.isRequired,
  onCloseModal: propTypes.func.isRequired,
};
