// frontend/src/pages/Room/RoomDetail.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { showToast } from '../../components/Toast';
import { Room } from '../../models/room.model';

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { user: string; message: string; time: string }[]
  >([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

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
            navigate('/room');
          }
        },
      );
    });

    newSocket.on('update_users', (users: { id: string }[]) => {
      console.log('현재 방의 사용자들:', users);
    });

    newSocket.on('new_user', (userId: string) => {
      showToast(`${userId}님이 방에 참여했습니다.`, 'info');
      initiatePeerConnection(newSocket, true);
    });

    newSocket.on('user_left', (userId: string) => {
      showToast(`${userId}님이 방을 떠났습니다.`, 'info');
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    });

    newSocket.on(
      'chat_message',
      (data: { user: string; message: string; time: string }) => {
        setMessages((prev) => [...prev, data]);
      },
    );

    // WebRTC 이벤트 핸들링
    newSocket.on('offer', async (offer: any, senderId: string) => {
      if (!peerConnection.current) initiatePeerConnection(newSocket, false);
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer!);
      newSocket.emit('answer', { roomId, answer }, senderId);
    });

    newSocket.on('answer', async (answer: any, senderId: string) => {
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    newSocket.on('ice_candidate', async (candidate: any, senderId: string) => {
      try {
        await peerConnection.current?.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      } catch (error) {
        console.error('Error adding received ice candidate', error);
      }
    });

    // 미디어 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        if (peerConnection.current) {
          stream
            .getTracks()
            .forEach((track) =>
              peerConnection.current?.addTrack(track, stream),
            );
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });

    return () => {
      if (newSocket) {
        newSocket.emit('leave_room', roomId, () => {
          newSocket.disconnect();
        });
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [roomId, navigate]);

  const initiatePeerConnection = (socket: Socket, isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit(
          'ice_candidate',
          { roomId, candidate: event.candidate },
          getTargetUserId(),
        );
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit(
          'offer',
          { roomId, offer: pc.localDescription },
          getTargetUserId(),
        );
      };
    }
  };

  const getTargetUserId = (): string | undefined => {
    // 현재 방의 다른 사용자를 식별하는 로직을 추가합니다.
    // 예를 들어, 첫 번째 사용자 ID를 반환하거나, 특정 로직에 따라 반환합니다.
    // 현재 예제에서는 단순히 'targetUserId'를 반환하도록 하겠습니다.
    // 실제 구현에서는 방의 사용자 목록을 관리하여 정확한 타겟을 지정해야 합니다.
    return undefined;
  };

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('chat_message', { roomName: roomId, message });
      setMessages((prev) => [
        ...prev,
        { user: '나', message, time: new Date().toLocaleTimeString() },
      ]);
      setMessage('');
    }
  };

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>유효하지 않은 방입니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">방 ID: {roomId}</h1>

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
    </div>
  );
};

export default RoomDetail;
