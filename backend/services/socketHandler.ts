// backend/services/socketHandler.ts

import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Room } from "../models/Room";
import {
  addRoom,
  removeRoom,
  getRooms,
  getRoom,
  addUserToRoom,
  removeUserFromRoom,
} from "./roomService";

dotenv.config();

interface AuthPayload {
  token: string;
}

interface DecodedToken {
  userId: string;
  username: string;
  // 필요한 다른 속성들 추가 가능
}

const socketHandler = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173", // 프론트엔드 주소
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 인증 미들웨어
  io.use((socket: Socket, next) => {
    const token = (socket.handshake.auth as AuthPayload).token;
    if (!token) {
      return next(new Error("인증 토큰이 필요합니다."));
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return next(new Error("유효하지 않은 토큰입니다."));
      }
      const user = decoded as DecodedToken;
      (socket as any).user = user;
      next();
    });
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).user.userId;
    const username = (socket as any).user.username;
    console.log(
      `클라이언트 연결: ${socket.id} (User ID: ${userId}, Username: ${username})`
    );

    // 방 목록 요청 처리
    socket.on("getRooms", async () => {
      try {
        const rooms = await getRooms();
        socket.emit("roomsList", rooms);
      } catch (error) {
        console.error("방 목록 조회 오류:", error);
        if (error instanceof Error) {
          socket.emit("error", error.message);
        } else {
          socket.emit("error", "방 목록을 불러오는 데 실패했습니다.");
        }
      }
    });

    // 방 생성 처리
    socket.on("createRoom", async (roomName: string) => {
      try {
        const newRoom = await addRoom(roomName, userId);
        io.emit("roomsUpdated", await getRooms());
        socket.join(newRoom.roomId);
        io.to(newRoom.roomId).emit("userListUpdate", newRoom.users);
        socket.emit("roomCreated", newRoom);
      } catch (error) {
        console.error("방 생성 오류:", error);
        if (error instanceof Error) {
          socket.emit("error", error.message);
        } else {
          socket.emit("error", "방 생성에 실패했습니다.");
        }
      }
    });

    // 방 참가 처리
    socket.on("joinRoom", async (roomId: string) => {
      try {
        const room = await addUserToRoom(roomId, userId);
        if (room) {
          socket.join(room.roomId);
          io.to(room.roomId).emit("userListUpdate", room.users);
          socket.emit("joinedRoom", room);
          io.to(room.roomId).emit("roomsUpdated", await getRooms());
        }
      } catch (error) {
        console.error("방 참가 오류:", error);
        if (error instanceof Error) {
          socket.emit("error", error.message);
        } else {
          socket.emit("error", "방 참가에 실패했습니다.");
        }
      }
    });

    // 방 나가기 처리
    socket.on("leaveRoom", async (roomId: string) => {
      try {
        const room = await removeUserFromRoom(roomId, userId);
        if (room) {
          socket.leave(room.roomId);
          io.to(room.roomId).emit("userListUpdate", room.users);
          io.to(room.roomId).emit("roomsUpdated", await getRooms());
        }
      } catch (error) {
        console.error("방 나가기 오류:", error);
        if (error instanceof Error) {
          socket.emit("error", error.message);
        } else {
          socket.emit("error", "방 나가기에 실패했습니다.");
        }
      }
    });

    // 방 삭제 처리 (방 생성자만 삭제 가능하도록 구현 필요)
    socket.on("deleteRoom", async (roomId: string) => {
      try {
        const room = await getRoom(roomId);
        if (room && room.createdBy === userId) {
          await removeRoom(roomId);
          io.emit("roomsUpdated", await getRooms());
          io.to(roomId).emit("roomDeleted", roomId);
          io.in(roomId).socketsLeave(roomId);
        } else {
          socket.emit("error", "방 삭제 권한이 없습니다.");
        }
      } catch (error) {
        console.error("방 삭제 오류:", error);
        if (error instanceof Error) {
          socket.emit("error", error.message);
        } else {
          socket.emit("error", "방 삭제에 실패했습니다.");
        }
      }
    });

    // 연결 해제 처리
    socket.on("disconnecting", async () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      for (const roomId of rooms) {
        try {
          const room = await removeUserFromRoom(roomId, userId);
          if (room) {
            io.to(room.roomId).emit("userListUpdate", room.users);
            io.to(room.roomId).emit("roomsUpdated", await getRooms());
          }
        } catch (error) {
          console.error("연결 해제 시 방에서 사용자 제거 오류:", error);
          // 에러가 발생해도 서버는 계속 동작하도록 함
        }
      }
      console.log(
        `클라이언트 연결 해제: ${socket.id} (User ID: ${userId}, Username: ${username})`
      );
    });

    socket.on("disconnect", () => {
      console.log(`클라이언트 완전히 연결 해제: ${socket.id}`);
    });
  });
};

export default socketHandler;
