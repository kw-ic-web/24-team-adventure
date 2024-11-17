import React from 'react';

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
        <p className="mb-4 text-white">{message}</p>
        <button
          onClick={onConfirm}
          className="p-2 bg-blue-600 text-white font-bold rounded-lg"
        >
          시작
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-gray-300 text-gray-800 font-bold rounded-lg ml-2"
        >
          취소
        </button>
      </div>
    </div>
  );
}
