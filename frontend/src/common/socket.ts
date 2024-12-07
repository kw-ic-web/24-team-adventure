import { io, Socket } from 'socket.io-client';

const socket: Socket = io('https://team05-server.kwweb.duckdns.org/', {
  withCredentials: true, // 쿠키 포함
});

export default socket;
