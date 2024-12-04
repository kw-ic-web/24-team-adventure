import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { showToast } from '../../components/Toast';
import { SOCKET_SERVER_URL } from '../../constants/socketUrl';

interface User {
  userId: string;
  userName: string;
}

const RoomDetail: React.FC = () => {
  const myUserId = localStorage.getItem('userId') || 'defaultUserId';
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

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { user: string; message: string; time: string }[]
  >([]);

  // 사용자 목록 상태 추가
  const [userList, setUserList] = useState<User[]>([]);

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

    // 사용자 목록 업데이트 이벤트 수신
    socket.on('userListUpdate', (users: User[]) => {
      console.log('사용자 목록 업데이트:', users);
      setUserList(users);
    });

    // 기존의 소켓 이벤트 핸들러들...

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
  }, [roomId, navigate]);

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

      {/* 사용자 목록 표시 */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">현재 입장한 사용자:</h3>
        <ul className="list-disc list-inside">
          {userList.map((user, index) => (
            <li key={index}>
              {user.userName} (ID: {user.userId})
            </li>
          ))}
        </ul>
      </div>

      {/* 비디오 스트림 영역 */}
      <div className="flex justify-center mb-6 space-x-4">
        <div>
          <h2 className="text-lg font-semibold">내 비디오</h2>
          <div className="video-container"></div>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-256 h-96 bg-black rounded"
          />
          <div className="overlay">
            <ul className="list-disc list-inside mt-2">
              {userList.length > 0 && (
                <li>
                  {userList[0].userId === myUserId
                    ? `나 (${userList[0].userName})`
                    : userList[0].userName}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div>
          <div className="video-container">
            <h2 className="text-lg font-semibold">상대방 비디오</h2>
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-256 h-96 bg-black rounded"
            />
            <div className="overlay">
              <ul className="list-disc list-inside mt-2">
                {userList.length > 1 && (
                  <li>
                    {userList[1].userId === myUserId
                      ? `나 (${userList[1].userName})`
                      : userList[1].userName}
                  </li>
                )}
              </ul>
            </div>
          </div>
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
