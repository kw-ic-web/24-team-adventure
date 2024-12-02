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
import { JWT_SECRET } from "../config/keys"; // JWT_SECRET 임포트 추가

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

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("Socket.IO 인증 토큰:", token);

    if (!token) {
      console.error("Socket.IO authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const tokenWithoutBearer = token.replace(/^Bearer\s/, "");
      console.log("Bearer 제거된 토큰:", tokenWithoutBearer);

      const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET) as {
        user_id: string;
      };
      console.log("Decoded JWT:", decoded);

      // socket.user에 사용자 정보 저장
      (socket as any).user = { userId: decoded.user_id };
      next();
    } catch (error) {
      console.error("Socket.IO authentication error: Invalid token", error);
      return next(new Error("Authentication error: Invalid token"));
    }
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
    socket.on("createRoom", async (roomName: string, callback) => {
      try {
        const newRoom = await addRoom(roomName, userId);
        // 방 생성 후 생성자를 방에 추가
        const updatedRoom = await addUserToRoom(newRoom.roomId, userId);
        if (updatedRoom) {
          socket.join(newRoom.roomId);
          io.to(newRoom.roomId).emit("userListUpdate", updatedRoom.users);
        }
        io.emit("roomsUpdated", await getRooms());
        callback({ success: true, roomId: newRoom.roomId });
      } catch (error) {
        console.error("방 생성 오류:", error);
        callback({ success: false, message: "방 생성에 실패했습니다." });
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
    socket.on("leaveRoom", async (roomId: string, callback) => {
      try {
        const room = await removeUserFromRoom(roomId, userId);
        if (room) {
          socket.leave(room.roomId);
          io.to(room.roomId).emit("userListUpdate", room.users);
          io.emit("roomsUpdated", await getRooms()); // 방 목록 업데이트
          callback({ success: true });
        } else {
          callback({ success: false, message: "방 나가기에 실패했습니다." });
        }
      } catch (error) {
        console.error("방 나가기 오류:", error);
        callback({ success: false, message: "방 나가기에 실패했습니다." });
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
