import React from 'react';
import './StartModal.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
}: ModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay my-modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm">
            시작
          </button>
          <button onClick={onClose} className="cancel">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
