import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { showToast } from '../../components/Toast';
import { SOCKET_SERVER_URL } from '../../constants/socketUrl';

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const roomName =
    new URLSearchParams(location.search).get('name') || '알 수 없음';

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // 추가된 상태 변수
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { user: string; message: string; time: string }[]
  >([]);

  useEffect(() => {
    console.log('useEffect 실행');

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

    // 소켓 및 피어 연결 초기화
    const socket = io(SOCKET_SERVER_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });
    peerConnectionRef.current = pc;

    // 소켓 이벤트 핸들러 등록
    socket.on('connect', () => {
      console.log('소켓 연결 성공');
      socket.emit(
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

    socket.on('offer', async ({ offer }) => {
      console.log('오퍼 수신:', offer);
      try {
        if (pc.signalingState !== 'closed') {
          if (
            !pc.currentRemoteDescription ||
            pc.signalingState === 'have-local-offer'
          ) {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log('앤서 전송:', answer);
            socket.emit('answer', { roomId, answer });
          }
        } else {
          console.error(
            'RTCPeerConnection이 닫혀 있어 오퍼를 처리할 수 없습니다.',
          );
        }
      } catch (error) {
        console.error('오퍼 처리 중 오류:', error);
      }
    });

    socket.on('answer', async ({ answer }) => {
      console.log('앤서 수신:', answer);
      try {
        if (pc.signalingState !== 'closed') {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          console.error(
            'RTCPeerConnection이 닫혀 있어 앤서를 처리할 수 없습니다.',
          );
        }
      } catch (error) {
        console.error('앤서 처리 중 오류:', error);
      }
    });

    socket.on('ice_candidate', async ({ candidate }) => {
      console.log('ICE 후보 수신:', candidate);
      try {
        if (pc.signalingState !== 'closed') {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          console.error(
            'RTCPeerConnection이 닫혀 있어 ICE 후보를 추가할 수 없습니다.',
          );
        }
      } catch (error) {
        console.error('ICE 후보 추가 중 오류:', error);
      }
    });

    // 피어 연결 이벤트 핸들러 등록
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('ICE 후보 전송:', event.candidate);
        socket.emit('ice_candidate', {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('원격 스트림 수신:', event.streams);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onnegotiationneeded = async () => {
      console.log('네고시에이션 필요');
      if (pc.signalingState === 'stable') {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log('오퍼 전송:', offer);
          socket.emit('offer', { roomId, offer });
        } catch (error) {
          console.error('오퍼 생성 중 오류:', error);
        }
      }
    };

    // 로컬 미디어 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localStreamRef.current = stream;

        // 로컬 트랙을 피어 연결에 추가
        stream.getTracks().forEach((track) => {
          console.log('트랙 추가:', track);
          pc.addTrack(track, stream);
        });
      })
      .catch((err) => {
        console.error('미디어 장치 접근 오류:', err);
      });

    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log('클린업 함수 실행');
      if (socketRef.current) {
        socketRef.current.emit(
          'leaveRoom',
          roomId,
          (response: { success: boolean }) => {
            if (response.success) {
              console.log('방에서 성공적으로 나갔습니다.');
            }
          },
        );
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (peerConnectionRef.current) {
        if (peerConnectionRef.current.signalingState !== 'closed') {
          console.log('RTCPeerConnection 닫힘');
          peerConnectionRef.current.close();
        }
        peerConnectionRef.current = null;
      }
    };
  }, [roomId, navigate]); // 의존성 배열에 roomId와 navigate 추가

  // 마이크 음소거 토글 함수 추가
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // 카메라 토글 함수 추가
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  // leaveRoom 함수 정의
  const leaveRoom = () => {
    if (socketRef.current) {
      console.log('방 나가기 버튼 클릭');
      socketRef.current.emit(
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

  // sendMessage 함수 정의 (필요한 경우)
  const sendMessage = () => {
    if (socketRef.current && message.trim()) {
      const chatMessage = {
        user: '나',
        message,
        time: new Date().toLocaleTimeString(),
      };
      // 채팅 기능을 구현하려면 서버로 메시지를 보내는 로직을 추가하세요.
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

      {/* 마이크 및 카메라 토글 버튼 추가 */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isMuted ? '마이크 켜기' : '마이크 끄기'}
        </button>
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isCameraOff ? '카메라 켜기' : '카메라 끄기'}
        </button>
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
