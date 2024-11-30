import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

interface Room {
  title: string;
  participants: number;
  maxParticipants: number;
}

interface User {
  username: string;
  roomName: string;
}

// 방 목록 초기화
export const rooms: Room[] = [
  { title: "room1", participants: 0, maxParticipants: 2 },
  { title: "room2", participants: 0, maxParticipants: 2 },
  { title: "room3", participants: 0, maxParticipants: 2 },
];

// io 변수 선언
export let io: Server;

export const socketHandler = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const users: Record<string, User> = {};

  io.on("connection", (socket: Socket) => {
    console.log("connection!", socket.id);

    socket.on("join_room", (roomName: string, username: string) => {
      const room = rooms.find((r) => r.title === roomName);

      if (room) {
        if (room.participants < room.maxParticipants) {
          room.participants += 1; // 참가자 수 증가
          socket.join(roomName); // 소켓 방에 조인
          users[socket.id] = { username, roomName };

          io.emit("roomUpdated", rooms); // 업데이트된 방 목록 브로드캐스트
          socket.to(roomName).emit("welcome", socket.id, username); // 같은 방의 다른 유저들에게 환영 메시지
          console.log(
            `${username} joined ${roomName}. Participants: ${room.participants}`
          );
        } else {
          socket.emit("room_full", roomName); // 방이 가득 찼을 때 알림
        }
      } else {
        socket.emit("room_not_found", roomName); // 방이 존재하지 않을 때 알림
      }
    });

    socket.on("offer", (offer: RTCSessionDescriptionInit, roomName: string) => {
      console.log("Received offer, sending to room:", roomName);
      socket
        .to(roomName)
        .emit("offer", offer, socket.id, users[socket.id].username);
    });

    socket.on(
      "answer",
      (answer: RTCSessionDescriptionInit, roomName: string) => {
        console.log("Received answer, sending to room:", roomName);
        socket
          .to(roomName)
          .emit("answer", answer, socket.id, users[socket.id].username);
      }
    );

    socket.on("ice", (ice: RTCIceCandidate, roomName: string) => {
      console.log("Received ICE candidate, sending to room:", roomName);
      socket.to(roomName).emit("ice", ice, socket.id);
    });

    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        const { roomName } = user;
        const room = rooms.find((r) => r.title === roomName);

        if (room) {
          room.participants = Math.max(0, room.participants - 1); // 참가자 수 감소
          io.emit("roomUpdated", rooms); // 업데이트된 방 목록 브로드캐스트
          console.log(
            `User ${user.username} left ${roomName}. Participants: ${room.participants}`
          );
        }
        delete users[socket.id];
      }
    });
  });
};
