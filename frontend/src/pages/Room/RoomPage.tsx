import React, { useState, useEffect } from 'react';
import { useRoomData } from '../../hooks/room/useRoomData';
import { showToast } from '../../components/Toast';
import { Room } from '../../models/room.model';
import io, { Socket } from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../../constants/socketUrl';
import { useQueryClient } from '@tanstack/react-query';
import Background from '../../components/ui/Background';

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
      <div className="page-container flex items-center justify-center">
        <p>방 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container flex items-center justify-center">
        <p>방 목록을 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div>
      
    <div className="page-container">
    <Background />
      <h1 className="title">화상채팅 방목록</h1>

      {/* 방 생성 섹션 */}
      <div className="input-section">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="새로운 방 이름"
          className="input-field"
        />
        <button onClick={onCreateRoom} className="create-button">
          방 생성
        </button>
      </div>

      {/* 방 목록 섹션 */}
      <div className="room-list-container">
        {rooms && rooms.length > 0 ? (
          <ul>
            {rooms.map((room: Room) => (
              <li key={room.roomId} className="room-item">
                <div className="room-info">
                  <h2 className="room-title">{room.roomName}</h2>
                  <p className="room-meta">참여자 수: {room.users.length}/2</p>
                </div>
                <div>
                  <button
                    onClick={() =>
                      (window.location.href = `/room/${room.roomId}?name=${encodeURIComponent(room.roomName)}`)
                    }
                    className="join-button"
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
    </div>
  );
}
