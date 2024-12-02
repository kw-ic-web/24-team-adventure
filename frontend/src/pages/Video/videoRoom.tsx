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
  const peerVideo1Ref = useRef<HTMLVideoElement>(null);
  const peerVideo2Ref = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const myPeerConnectionsRef = useRef<PeerConnection>({});

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    const urlParams = new URLSearchParams(window.location.search);
    const roomNameParam = urlParams.get('title');

    if (!roomNameParam) {
      alert('방 제목이 필요합니다.');
      window.location.href = '/home';
      return;
    }

    setRoomName(roomNameParam);

    const initializeRoom = async () => {
      setUsername(userData?.name);
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
    Object.values(myPeerConnectionsRef.current).forEach((pc) => {
      const videoTrack = myStream?.getVideoTracks()[0];
      if (videoTrack) {
        const videoSender = pc
          .getSenders()
          .find((sender) => sender.track?.kind === 'video');
        if (videoSender) videoSender.replaceTrack(videoTrack);
      }
    });
  };

  const startMedia = async () => {
    await getMedia();
    socketRef.current?.emit('join_room', roomName, username);
  };

  const createPeerConnection = (userId: string, peerUsername: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        socketRef.current?.emit('ice', event.candidate, roomName, userId);
      }
    });

    peerConnection.addEventListener('track', (event) => {
      if (event.streams && event.streams[0]) {
        updatePeerVideo(userId, peerUsername, event.streams[0]);
      }
    });

    myStream
      ?.getTracks()
      .forEach((track) => peerConnection.addTrack(track, myStream));

    return peerConnection;
  };

  const updatePeerVideo = (
    userId: string,
    peerUsername: string,
    stream: MediaStream,
  ) => {
    const peerVideoElements = [peerVideo1Ref.current, peerVideo2Ref.current];
    const peerIdElements = [
      document.getElementById('peerId1'),
      document.getElementById('peerId2'),
    ];

    for (let i = 0; i < peerVideoElements.length; i++) {
      if (
        peerVideoElements[i] &&
        (!peerVideoElements[i]?.srcObject ||
          peerIdElements[i]?.textContent?.includes(userId))
      ) {
        peerVideoElements[i]!.srcObject = stream;
        if (peerIdElements[i])
          peerIdElements[i]!.textContent =
            `Peer ID: ${peerUsername} (${userId})`;
        break;
      }
    }
  };
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on(
      'welcome',
      async (userId: string, peerUsername: string) => {
        if (!myPeerConnectionsRef.current[userId]) {
          const newPeerConnection = createPeerConnection(userId, peerUsername);
          myPeerConnectionsRef.current[userId] = newPeerConnection;

          const offer = await newPeerConnection.createOffer();
          await newPeerConnection.setLocalDescription(offer);
          socketRef.current?.emit('offer', offer, roomName, userId);
        }
      },
    );

    socketRef.current.on(
      'offer',
      async (
        offer: RTCSessionDescriptionInit,
        userId: string,
        peerUsername: string,
      ) => {
        if (!myPeerConnectionsRef.current[userId]) {
          const newPeerConnection = createPeerConnection(userId, peerUsername);
          myPeerConnectionsRef.current[userId] = newPeerConnection;

          await newPeerConnection.setRemoteDescription(offer);
          const answer = await newPeerConnection.createAnswer();
          await newPeerConnection.setLocalDescription(answer);
          socketRef.current?.emit('answer', answer, roomName, userId);
        }
      },
    );

    socketRef.current.on(
      'answer',
      (answer: RTCSessionDescriptionInit, userId: string) => {
        if (myPeerConnectionsRef.current[userId]) {
          myPeerConnectionsRef.current[userId].setRemoteDescription(answer);
        }
      },
    );

    socketRef.current.on(
      'ice',
      (iceCandidate: RTCIceCandidate, userId: string) => {
        if (myPeerConnectionsRef.current[userId]) {
          myPeerConnectionsRef.current[userId].addIceCandidate(
            new RTCIceCandidate(iceCandidate),
          );
        }
      },
    );
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
        <div className="col-3"></div>
        <div className="col-6" id="call">
          <div className="flex justify-center gap-5 flex-wrap mb-5">
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
            <div className="text-center">
              <video
                ref={peerVideo1Ref}
                autoPlay
                playsInline
                className="border-2 border-gray-300 rounded-md"
              />
              <div>Peer 1</div>
            </div>
            <div className="text-center">
              <video
                ref={peerVideo2Ref}
                autoPlay
                playsInline
                className="border-2 border-gray-300 rounded-md"
              />
              <div>Peer 2</div>
            </div>
          </div>
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
        <div className="col-3"></div>
      </div>
    </div>
  );
};

export default WebRTCRoom;
