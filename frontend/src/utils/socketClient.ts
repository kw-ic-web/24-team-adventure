import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://team05.server.duckdns.org';

const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기

const authToken = token ? `Bearer ${token}` : null;

console.log('Socket.IO 클라이언트 토큰:', authToken);

const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket'],
  withCredentials: true,
  auth: {
    token: authToken, // 토큰이 있을 때만 전송
  },
});

export default socket;
