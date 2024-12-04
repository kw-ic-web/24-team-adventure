import React, { useState } from 'react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roomName: string) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onCreate(roomName.trim());
      setRoomName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="방 이름"
          required
        />
        <button type="submit">생성</button>
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </form>
    </div>
  );
};

export default CreateRoomModal;
