import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

interface User {
  nickname: string;
  point: number;
}

interface UserMap {
  [socketId: string]: User;
}

export const socketHandler = (server: HttpServer): void => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const user: UserMap = {};

  io.on("connection", (socket: Socket) => {
    const req = socket.request as any; // Express request object
    const socket_id = socket.id;
    const client_ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    console.log("connection!");
    console.log("socket ID : ", socket_id);
    console.log("client IP : ", client_ip);

    user[socket.id] = { nickname: "users nickname", point: 0 };

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      delete user[socket.id];
    });

    socket.on("join_room", (roomName: string) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
      console.log(`User joined room: ${roomName}`);
    });

    socket.on("offer", (offer: any, roomName: string) => {
      console.log("Received offer, sending to room:", roomName);
      socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer: any, roomName: string) => {
      console.log("Received answer, sending to room:", roomName);
      socket.to(roomName).emit("answer", answer);
    });

    socket.on("ice", (ice: any, roomName: string) => {
      console.log("Received ICE candidate, sending to room:", roomName);
      socket.to(roomName).emit("ice", ice);
    });
  });
};
