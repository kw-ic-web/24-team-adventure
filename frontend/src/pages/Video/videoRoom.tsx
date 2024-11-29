import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Socket.IO 인스턴스 생성
const socket = io();

export default function Room() {
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
      : { audio: true, video: { facingMode: 'user' } };

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

    peerConnection.addEventListener('icecandidate', (data) => {
      if (data.candidate) {
        socket.emit('ice', data.candidate, roomName);
      }
    });

    peerConnection.addEventListener('track', (event: RTCTrackEvent) => {
      const [stream] = event.streams; // track 이벤트의 streams 배열에서 스트림 추출
      if (peerFaceRef.current && stream) {
        peerFaceRef.current.srcObject = stream; // 비디오 요소에 스트림 연결
      }
    });

    if (currentStream) {
      currentStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, currentStream));
    }

    setMyPeerConnection(peerConnection);
  };

  // Socket event listeners
  useEffect(() => {
    socket.on('welcome', async () => {
      if (myPeerConnection) {
        const offer = await myPeerConnection.createOffer();
        myPeerConnection.setLocalDescription(offer);
        socket.emit('offer', offer, roomName);
      }
    });

    socket.on('offer', async (offer) => {
      if (myPeerConnection) {
        myPeerConnection.setRemoteDescription(offer);
        const answer = await myPeerConnection.createAnswer();
        myPeerConnection.setLocalDescription(answer);
        socket.emit('answer', answer, roomName);
      }
    });

    socket.on('answer', (answer) => {
      if (myPeerConnection) {
        myPeerConnection.setRemoteDescription(answer);
      }
    });

    socket.on('ice', (ice) => {
      if (myPeerConnection) {
        myPeerConnection.addIceCandidate(ice);
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
