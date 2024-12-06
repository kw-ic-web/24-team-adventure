import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://223.194.46.67:20590', {
  withCredentials: true, // 쿠키 포함
});

export default socket;
