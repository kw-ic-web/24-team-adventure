// frontend/src/hooks/room/useSocket.ts
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../../constants/url';
import { showToast } from '../../components/Toast';

const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token,
      },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('소켓 연결됨');
      newSocket.emit(
        'join_room',
        roomId,
        (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            showToast(response.message || '방에 참여할 수 없습니다.', 'error');
          }
        },
      );
    });

    newSocket.on('disconnect', () => {
      console.log('소켓 연결 해제됨');
    });

    return () => {
      newSocket.emit('leave_room', roomId, () => {
        newSocket.disconnect();
      });
    };
  }, [roomId]);

  return socket;
};

export default useSocket;
