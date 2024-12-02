import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { showToast } from '../../components/Toast';

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const roomName =
    new URLSearchParams(location.search).get('name') || '알 수 없음';
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { user: string; message: string; time: string }[]
  >([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!roomId) {
      showToast('유효하지 않은 방입니다.', 'error');
      navigate('/room');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('로그인이 필요합니다.', 'error');
      navigate('/');
      return;
    }

    // 소켓 초기화
    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER_URL as string, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('소켓 연결 성공');
      newSocket.emit(
        'joinRoom',
        roomId,
        (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            showToast(response.message || '방에 참여할 수 없습니다.', 'error');
            navigate('/room');
          }
        },
      );
    });

    newSocket.on('update_users', (users: { id: string }[]) => {
      console.log('현재 방의 사용자들:', users);
    });

    newSocket.on(
      'chat_message',
      (data: { user: string; message: string; time: string }) => {
        setMessages((prev) => [...prev, data]);
      },
    );

    // WebRTC 미디어 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });

    return () => {
      if (newSocket) {
        newSocket.emit(
          'leaveRoom',
          roomId,
          (response: { success: boolean }) => {
            if (response.success) {
              console.log('방에서 성공적으로 나갔습니다.');
            }
          },
        );
        newSocket.disconnect();
      }
    };
  }, [roomId, navigate]);

  const leaveRoom = () => {
    if (socket) {
      console.log('방 나가기 버튼 클릭');
      socket.emit(
        'leaveRoom',
        roomId,
        (response: { success: boolean; message?: string }) => {
          if (response.success) {
            console.log('방 나가기 성공');
            navigate('/room'); // 방 목록 화면으로 이동
            showToast('방을 떠났습니다.', 'info');
          } else {
            showToast(response.message || '방 나가기에 실패했습니다.', 'error');
          }
        },
      );
    } else {
      console.error('소켓이 초기화되지 않았습니다.');
    }
  };

  const sendMessage = () => {
    if (socket && message.trim()) {
      const chatMessage = {
        user: '나',
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('chat_message', { roomName, message });
      setMessages((prev) => [...prev, chatMessage]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">방 ID: {roomId}</h1>
      <h2 className="text-lg font-semibold mb-4">방 이름: {roomName}</h2>

      {/* 비디오 스트림 영역 */}
      <div className="flex justify-center mb-6 space-x-4">
        <div>
          <h2 className="text-lg font-semibold">내 비디오</h2>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-64 h-48 bg-black rounded"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">상대방 비디오</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-64 h-48 bg-black rounded"
          />
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="mb-4 p-4 bg-white rounded shadow h-40 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>
              {msg.user} [{msg.time}]:{' '}
            </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      {/* 메시지 입력 영역 */}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 border border-gray-300 rounded mr-2"
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          보내기
        </button>
      </div>

      {/* 방 나가기 버튼 */}
      <button
        onClick={leaveRoom}
        className="px-4 py-2 mt-4 bg-red-500 text-white rounded"
      >
        방 나가기
      </button>
    </div>
  );
};

export default RoomDetail;
