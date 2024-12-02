// frontend/src/pages/Room/RoomPage.tsx

import React, { useState, useEffect } from 'react';
import { useRoomData } from '../../hooks/room/useRoomData';
import { Link } from 'react-router-dom';
import { showToast } from '../../components/Toast';
import { Room } from '../../models/room.model';
import io, { Socket } from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../../constants/socketUrl';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  userId: string;
  username: string;
}

export default function RoomPage() {
  const { rooms, isLoading, isError, handleCreateRoom } = useRoomData();
  const [newRoomName, setNewRoomName] = useState('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  // 소켓 연결 및 이벤트 핸들링
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('소켓 연결 성공:', newSocket.id);
      newSocket.emit('getRooms');
    });

    newSocket.on('connect_error', (err) => {
      console.error('소켓 연결 오류:', err.message);
      showToast('소켓 연결에 실패했습니다.', 'error');
    });

    newSocket.on('roomsList', (rooms: Room[]) => {
      queryClient.setQueryData(['rooms'], rooms);
    });

    newSocket.on('roomsUpdated', (updatedRooms: Room[]) => {
      queryClient.setQueryData(['rooms'], updatedRooms);
      showToast('방 목록이 업데이트되었습니다.', 'info');
    });

    newSocket.on('roomCreated', (newRoom: Room) => {
      showToast(`방 "${newRoom.roomName}"이 생성되었습니다!`, 'success');
    });

    newSocket.on('joinedRoom', (room: Room) => {
      setCurrentRoom(room);
      showToast(`방 "${room.roomName}"에 참가했습니다.`, 'success');
    });

    newSocket.on('userListUpdate', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    newSocket.on('roomDeleted', (roomId: string) => {
      if (currentRoom && currentRoom.roomId === roomId) {
        setCurrentRoom(null);
        setUsers([]);
        showToast('방이 삭제되었습니다.', 'info');
      }
    });

    newSocket.on('error', (message: string) => {
      showToast(message, 'error');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_SERVER_URL, queryClient, currentRoom]);

  const onCreateRoom = () => {
    if (!newRoomName.trim()) {
      showToast('방 이름을 입력해주세요.', 'warning');
      return;
    }
    handleCreateRoom(newRoomName);
    setNewRoomName('');
  };

  const onJoinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    }
  };

  const onLeaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leaveRoom', roomId);
      setCurrentRoom(null);
      setUsers([]);
    }
  };

  const onDeleteRoom = (roomId: string) => {
    if (socket) {
      socket.emit('deleteRoom', roomId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>방 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>방 목록을 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">화상채팅 방</h1>

      {/* 방 생성 섹션 */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="새로운 방 이름"
          className="p-3 border border-gray-300 rounded-l-md w-1/2"
        />
        <button
          onClick={onCreateRoom}
          className="px-6 py-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
        >
          방 생성
        </button>
      </div>

      {/* 방 목록 섹션 */}
      <div className="max-w-4xl mx-auto">
        {rooms && rooms.length > 0 ? (
          <ul className="space-y-4">
            {rooms.map((room: Room) => (
              <li
                key={room.roomId}
                className="flex justify-between items-center p-6 bg-white rounded-lg shadow-md"
              >
                <div>
                  <h2 className="text-2xl font-semibold">{room.roomName}</h2>
                  <p className="text-gray-600">생성자: {room.createdBy}</p>
                  <p className="text-gray-600">
                    참여자 수: {room.users.length}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onJoinRoom(room.roomId)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    들어가기
                  </button>
                  {room.createdBy === localStorage.getItem('userId') && (
                    <button
                      onClick={() => onDeleteRoom(room.roomId)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            현재 생성된 방이 없습니다.
          </p>
        )}
      </div>

      {/* 현재 참여 중인 방 섹션 */}
      {currentRoom && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            현재 참여 중인 방: {currentRoom.roomName}
          </h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">참여자 목록:</h3>
            <ul className="list-disc list-inside">
              {users.map((user) => (
                <li key={user.userId}>{user.username}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => onLeaveRoom(currentRoom.roomId)}
            className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            방 나가기
          </button>
        </div>
      )}
    </div>
  );
}
