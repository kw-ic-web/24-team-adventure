import React, { useState, useEffect } from 'react';
import { useRoomData } from '../../hooks/room/useRoomData';
import { showToast } from '../../components/Toast';
import { Room } from '../../models/room.model';
import io, { Socket } from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../../constants/socketUrl';
import { useQueryClient } from '@tanstack/react-query';
import './RoomPage.css';

export default function RoomPage() {
  const { rooms, isLoading, isError } = useRoomData();
  const [newRoomName, setNewRoomName] = useState('');
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

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

    newSocket.on('error', (message: string) => {
      showToast(message, 'error');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [queryClient]);

  const onCreateRoom = () => {
    if (!newRoomName.trim()) {
      showToast('방 이름을 입력해주세요.', 'warning');
      return;
    }

    if (socket) {
      socket.emit(
        'createRoom',
        newRoomName,
        (response: { success: boolean; roomId?: string; message?: string }) => {
          if (response.success && response.roomId) {
            showToast(`방 "${newRoomName}"이 생성되었습니다!`, 'success');
            setNewRoomName('');
            // 방 생성 성공 시 해당 방으로 이동 (방 이름 포함)
            window.location.href = `/room/${response.roomId}?name=${encodeURIComponent(newRoomName)}`;
          } else {
            showToast(response.message || '방 생성에 실패했습니다.', 'error');
          }
        },
      );
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
                    참여자 수: {room.users.length}/2
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/room/${room.roomId}?name=${encodeURIComponent(room.roomName)}`)
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    들어가기
                  </button>
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
    </div>
  );
}
