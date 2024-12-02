// frontend/src/components/RoomList.tsx

import React from 'react';

interface Room {
  name: string;
  users: number;
  available: boolean;
}

interface RoomListProps {
  rooms: Room[];
  onJoin: (roomName: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onJoin }) => {
  return (
    <ul className="list-group">
      {rooms.map((room) => (
        <li
          key={room.name}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>
            {room.name} ({room.users}/3)
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={!room.available}
            onClick={() => onJoin(room.name)}
          >
            참가
          </button>
        </li>
      ))}
    </ul>
  );
};

export default RoomList;
