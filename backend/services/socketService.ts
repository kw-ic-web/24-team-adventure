import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

interface Room {
  title: string;
  participants: number;
  maxParticipants: number;
}

interface User {
  username: string;
  roomName: string;
}

export const rooms: Room[] = [
  { title: "room1", participants: 0, maxParticipants: 2 },
  { title: "room2", participants: 0, maxParticipants: 2 },
  { title: "room3", participants: 0, maxParticipants: 2 },
];

let io: Server;

const socketHandler = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const users: { [key: string]: User } = {};

  io.on("connection", (socket: Socket) => {
    console.log("connection!", socket.id);
    console.log("type", typeof socket.id);

    socket.on("join_room", (roomName: string, username: string) => {
      const room = rooms.find((r) => r.title === roomName);

      if (room) {
        if (room.participants < room.maxParticipants) {
          room.participants += 1;
          socket.join(roomName);
          users[socket.id] = { username, roomName };

          io.emit("roomUpdated", rooms);
          socket.to(roomName).emit("welcome", socket.id, username);
          console.log(
            `${username} joined ${roomName}. Participants: ${room.participants}`
          );
        } else {
          socket.emit("room_full", roomName);
        }
      } else {
        socket.emit("room_not_found", roomName);
      }
    });

    socket.on("offer", (offer: any, roomName: string) => {
      socket
        .to(roomName)
        .emit("offer", offer, socket.id, users[socket.id].username);
    });

    socket.on("answer", (answer: any, roomName: string) => {
      socket
        .to(roomName)
        .emit("answer", answer, socket.id, users[socket.id].username);
    });

    socket.on("ice", (ice: any, roomName: string) => {
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

  return { io, rooms };
};

export { io };
export default socketHandler;
