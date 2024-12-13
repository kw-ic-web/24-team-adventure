import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  addRoom,
  removeRoom,
  getRooms,
  getRoom,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  removeEmptyRooms, // 사용자 목록을 가져오는 함수 임포트
} from "./roomService";
import { JWT_SECRET } from "../config/keys";
import { getUserById } from "./userService"; // 사용자 정보를 가져오는 함수 임포트

dotenv.config();

// 방 삭제 타이머 관리 객체
const roomDeletionTimers: Record<string, NodeJS.Timeout> = {};

const socketHandler = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "https://team05.kwweb.duckdns.org", // 프론트엔드 주소
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 인증 미들웨어
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error("Socket.IO authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const tokenWithoutBearer = token.replace(/^Bearer\s/, "");
      const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET) as {
        user_id: string;
      };
      (socket as any).user = { userId: decoded.user_id };
      next();
    } catch (error) {
      console.error("Socket.IO authentication error: Invalid token", error);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).user.userId;

    console.log(`Client connected: ${socket.id} (User ID: ${userId})`);

    // 방 목록 요청 처리
    socket.on("getRooms", async () => {
      try {
        const rooms = await getRooms();
        socket.emit("roomsList", rooms);
      } catch (error) {
        console.error("Error fetching room list:", error);
        socket.emit("error", "Failed to fetch room list.");
      }
    });

    // 방 생성 처리
    socket.on("createRoom", async (roomName: string, callback) => {
      try {
        const newRoom = await addRoom(roomName, userId);
        const updatedRoom = await addUserToRoom(newRoom.roomId, userId);

        if (updatedRoom) {
          socket.join(newRoom.roomId);
          io.to(newRoom.roomId).emit("userListUpdate", updatedRoom.users);
        }
        io.emit("roomsUpdated", await getRooms());
        callback({ success: true, roomId: newRoom.roomId });
      } catch (error) {
        console.error("Error creating room:", error);
        callback({ success: false, message: "Failed to create room." });
      }
    });

    // 방 참가 처리
    socket.on("joinRoom", async (roomId: string, callback) => {
      try {
        const room = await getRoom(roomId);

        if (room && room.users.length >= 2) {
          callback({ success: false, message: "Room is full." });
          return;
        }

        const updatedRoom = await addUserToRoom(roomId, userId);
        if (updatedRoom) {
          socket.join(roomId);
          // 방의 사용자 목록 업데이트
          const usersInRoom = await getUsersInRoom(roomId);
          io.to(roomId).emit("userListUpdate", usersInRoom);
          callback({ success: true });
        } else {
          callback({ success: false, message: "Failed to join room." });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        callback({ success: false, message: "Failed to join room." });
      }
    });

    // 방 나가기 처리
    socket.on("leaveRoom", async (roomId, callback) => {
      try {
        const room = await removeUserFromRoom(roomId, userId);
        if (room) {
          socket.leave(room.roomId);

          // 방의 사용자 목록 업데이트
          const usersInRoom = await getUsersInRoom(roomId);
          io.to(room.roomId).emit("userListUpdate", usersInRoom);

          // 방 삭제 타이머 설정
          if (usersInRoom.length === 0) {
            if (!roomDeletionTimers[roomId]) {
              roomDeletionTimers[roomId] = setTimeout(async () => {
                const updatedRoom = await getRoom(roomId);
                if (updatedRoom && updatedRoom.users.length === 0) {
                  await removeRoom(roomId);
                  console.log(`방 ${roomId} 삭제`);
                  io.emit("roomsUpdated", await getRooms());
                }
                delete roomDeletionTimers[roomId];
              }, 5000); // 5초 후 삭제 시도
              console.log(`방 ${roomId} 삭제 타이머 설정`);
            }
          }

          callback({ success: true });
        } else {
          callback({ success: false, message: "Failed to leave room." });
        }
      } catch (error) {
        console.error("Error leaving room:", error);
        callback({ success: false, message: "Failed to leave room." });
      }
    });

    // WebRTC Offer 처리
    socket.on("offer", ({ roomId, offer }) => {
      console.log("오퍼 전달:", offer);
      socket.to(roomId).emit("offer", { offer });
    });

    // WebRTC Answer 처리
    socket.on("answer", ({ roomId, answer }) => {
      console.log("앤서 전달:", answer);
      socket.to(roomId).emit("answer", { answer });
    });

    // ICE Candidate 처리
    socket.on("ice_candidate", ({ roomId, candidate }) => {
      console.log("ICE 후보 전달:", candidate);
      socket.to(roomId).emit("ice_candidate", { candidate });
    });

    // 연결 해제 처리
    socket.on("disconnecting", async () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      for (const roomId of rooms) {
        try {
          const room = await removeUserFromRoom(roomId, userId);
          if (room) {
            // 방의 사용자 목록 업데이트
            const usersInRoom = await getUsersInRoom(roomId);
            io.to(room.roomId).emit("userListUpdate", usersInRoom);

            // 방 삭제 타이머 설정
            if (usersInRoom.length === 0) {
              if (!roomDeletionTimers[roomId]) {
                roomDeletionTimers[roomId] = setTimeout(async () => {
                  const updatedRoom = await getRoom(roomId);
                  if (updatedRoom && updatedRoom.users.length === 0) {
                    await removeRoom(roomId);
                    console.log(`방 ${roomId} 삭제`);
                    io.emit("roomsUpdated", await getRooms());
                  }
                  delete roomDeletionTimers[roomId];
                }, 5000); // 5초 후 삭제 시도
                console.log(`방 ${roomId} 삭제 타이머 설정`);
              }
            }
          }
        } catch (error) {
          console.error("Error during disconnecting:", error);
        }
      }
    });
  });
};

export default socketHandler;
