// components/Common/ConfirmModal.js

import React from "react";
import "./ConfirmModal.css"; // Optional for styling

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h5>{title}</h5>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-danger me-2" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
