import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useUserData } from '../../hooks/auth/useUserData';

// Socket.IO 인스턴스 생성
const socket = io('http://localhost:3000');

export default function Room() {
  // 사용자 데이터를 불러오는 hook
  const { data: userData, isLoading: userLoading } = useUserData();
  // States
  const [roomName, setRoomName] = useState<string>(''); // 방 이름
  const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false); // 방 참여 여부
  const [isMuted, setIsMuted] = useState<boolean>(false); // 음소거 상태
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false); // 카메라 상태
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]); // 장치 목록
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null); // 현재 스트림
  const [myPeerConnection, setMyPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  // Refs for video elements
  const myFaceRef = useRef<HTMLVideoElement | null>(null);
  const peerFaceRef = useRef<HTMLVideoElement | null>(null);

  // Handlers
  const handleMuteClick = () => {
    if (currentStream) {
      currentStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted((prev) => !prev);
    }
  };

  const handleCameraClick = () => {
    if (currentStream) {
      currentStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsCameraOff((prev) => !prev);
    }
  };

  const handleCameraChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    await getMedia(e.target.value);
    if (myPeerConnection) {
      const videoTrack = currentStream?.getVideoTracks()[0];
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track?.kind === 'video');
      if (videoSender && videoTrack) {
        videoSender.replaceTrack(videoTrack);
      }
    }
  };

  // Join room
  const handleEnterRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setIsRoomJoined(true);
    await getMedia();
    makeConnection();

    socket.emit('join_room', roomName);
  };

  // Get Media (Audio/Video)
  const getMedia = async (deviceId?: string) => {
    const constraints = deviceId
      ? { audio: true, video: { deviceId: { exact: deviceId } } }
      : { audio: true, video: { facingMode: 'user' } }; //스마트폰일 때 전면카메라 우선 동작

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentStream(stream);

      if (myFaceRef.current) {
        myFaceRef.current.srcObject = stream;
      }

      if (!deviceId) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );
        setDevices(videoDevices);
      }
    } catch (err) {
      console.error('Failed to get media:', err);
    }
  };

  // WebSocket and WebRTC
  const makeConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    });

    // ICE 후보 처리
    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
        socket.emit('ice', event.candidate, roomName); // ICE 후보를 서버에 전송
      }
    });

    // 상대방의 트랙을 받을 때 처리
    peerConnection.addEventListener('track', (event: RTCTrackEvent) => {
      const [stream] = event.streams;
      console.log('Received stream from peer:', stream);
      if (peerFaceRef.current && stream) {
        peerFaceRef.current.srcObject = stream; // 상대방 비디오 스트림을 화면에 표시
      }
    });

    // 내 스트림을 상대에게 전달
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, currentStream); // 내 스트림을 상대에게 전송
      });
    }

    setMyPeerConnection(peerConnection); // peerConnection 상태 업데이트
  };

  // Socket event listeners
  useEffect(() => {
    socket.on('welcome', async () => {
      console.log("Received 'welcome' message, creating offer...");
      if (myPeerConnection) {
        const offer = await myPeerConnection.createOffer();
        myPeerConnection.setLocalDescription(offer);
        socket.emit('offer', offer, roomName);
      }
    });

    socket.on('offer', async (offer) => {
      console.log("Received 'offer' from peer:", offer);
      if (myPeerConnection) {
        myPeerConnection.setRemoteDescription(offer);
        const answer = await myPeerConnection.createAnswer();
        myPeerConnection.setLocalDescription(answer);
        socket.emit('answer', answer, roomName);
      }
    });

    socket.on('answer', (answer) => {
      console.log("Received 'answer' from peer:", answer);
      if (myPeerConnection) {
        myPeerConnection.setRemoteDescription(answer);
      }
    });

    socket.on('ice', (ice) => {
      console.log('Received ICE candidate:', ice);
      if (myPeerConnection) {
        myPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
      }
    });

    return () => {
      socket.off('welcome');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice');
    };
  }, [myPeerConnection, roomName]);

  return (
    <div className="container-fluid">
      {!isRoomJoined && (
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6" id="welcome">
            <form onSubmit={handleEnterRoom}>
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
              <button type="submit">Enter Room</button>
            </form>
          </div>
          <div className="col-3"></div>
        </div>
      )}

      {isRoomJoined && (
        <div className="row" id="call">
          <div className="col-3"></div>
          <div className="col-6" id="myStream">
            <video
              ref={myFaceRef}
              autoPlay
              playsInline
              width="300"
              height="300"
            ></video>
            <button onClick={handleMuteClick}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button onClick={handleCameraClick}>
              {isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            </button>
            <select onChange={handleCameraChange}>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>
            <video
              ref={peerFaceRef}
              autoPlay
              playsInline
              width="300"
              height="300"
            ></video>
          </div>
          <div className="col-3"></div>
        </div>
      )}
    </div>
  );
}
