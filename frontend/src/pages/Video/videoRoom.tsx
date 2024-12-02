import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUserData } from '../../hooks/auth/useUserData';

interface PeerConnection {
  [key: string]: RTCPeerConnection;
}

const WebRTCRoom: React.FC = () => {
  const { data: userData } = useUserData();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    console.log('Socket connected:', socketRef.current.connected);
    const urlParams = new URLSearchParams(window.location.search);
    const roomNameParam = urlParams.get('title');

    if (!roomNameParam) {
      alert('방 제목이 필요합니다.');
      window.location.href = '/home';
      return;
    }

    setRoomName(roomNameParam);

    const initializeRoom = async () => {
      console.log('Initializing room:', roomNameParam);
      setUsername(userData?.name || '');
      await startMedia();
    };

    initializeRoom();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput',
      );
      setCameras(videoDevices);
      if (myStream) {
        const currentCamera = myStream.getVideoTracks()[0];
        setSelectedCamera(currentCamera.getSettings().deviceId || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getMedia = async (deviceId?: string) => {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: 'user' },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMyStream(stream);
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      if (!deviceId) await getCameras();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMuteClick = () => {
    if (myStream) {
      myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setMuted(!muted);
    }
  };

  const handleCameraClick = () => {
    if (myStream) {
      myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setCameraOff(!cameraOff);
    }
  };

  const handleCameraChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    await getMedia(event.target.value);
    setSelectedCamera(event.target.value);
    if (peerConnectionRef.current) {
      const videoTrack = myStream?.getVideoTracks()[0];
      if (videoTrack) {
        const videoSender = peerConnectionRef.current
          .getSenders()
          .find((sender) => sender.track?.kind === 'video');
        if (videoSender) videoSender.replaceTrack(videoTrack);
      }
    }
  };

  const startMedia = async () => {
    await getMedia();
    socketRef.current?.emit('join_room', roomName, username);
    console.log('Joined room:', roomName, 'as', username);
  };

  const createPeerConnection = () => {
    console.log('Creating peer connection');
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        console.log('ICE candidate generated:', event.candidate);
        socketRef.current?.emit('ice', event.candidate, roomName);
      }
    });

    peerConnection.addEventListener('track', (event) => {
      console.log('Track received:', event.track.kind);
      if (event.streams && event.streams[0]) {
        if (peerVideoRef.current) {
          console.log('Setting peer video source');
          peerVideoRef.current.srcObject = event.streams[0];
        }
      }
    });

    myStream?.getTracks().forEach((track) => {
      console.log('Adding local track to peer connection:', track.kind);
      peerConnection.addTrack(track, myStream);
    });
    return peerConnection;
  };

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('welcome', async () => {
      console.log('Received welcome event');
      peerConnectionRef.current = createPeerConnection();
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current?.emit('offer', offer, roomName);
    });

    socketRef.current.on('offer', async (offer: RTCSessionDescriptionInit) => {
      console.log('Received offer');
      peerConnectionRef.current = createPeerConnection();
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      console.log('Created and set local offer');
      socketRef.current?.emit('answer', answer, roomName);
    });

    socketRef.current.on('answer', (answer: RTCSessionDescriptionInit) => {
      console.log('Received answer');
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socketRef.current.on('ice', (iceCandidate: RTCIceCandidate) => {
      console.log('Received ICE candidate');
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(iceCandidate),
        );
      }
    });
  }, [roomName, username]);

  return (
    <div className="container mt-4">
      <h2 className="text-center">WebRTC Room</h2>
      <div className="text-right mb-3">
        {userData ? `Welcome, ${userData.name}` : 'Loading user info...'}
      </div>
      <div className="text-center mb-3">
        Room Name: {roomName || 'Loading...'}
      </div>
      <div className="row">
        <div className="col-6">
          <div className="text-center">
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted={muted}
              className="border-2 border-gray-300 rounded-md"
            />
            <div>You</div>
          </div>
        </div>
        <div className="col-6">
          <div className="text-center">
            <video
              ref={peerVideoRef}
              autoPlay
              playsInline
              className="border-2 border-gray-300 rounded-md"
            />
            <div>Peer</div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 text-center">
          <button
            onClick={handleMuteClick}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button
            onClick={handleCameraClick}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            {cameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
          </button>
          <select
            value={selectedCamera}
            onChange={handleCameraChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WebRTCRoom;
