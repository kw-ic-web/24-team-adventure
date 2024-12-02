// frontend/src/common/socket.ts

import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000', {
  withCredentials: true, // 쿠키 포함
});

export default socket;
