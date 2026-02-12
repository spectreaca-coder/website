import React from 'react';
import './Modal.css';

const Modal = ({ children, onClose, disableOutsideClick = false }) => {
  const handleOverlayClick = (e) => {
    if (!disableOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {!disableOutsideClick && (
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
