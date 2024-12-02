import express, { Request, Response } from "express";
import { getRooms, addRoom, removeRoom } from "../services/roomService";
import { Room } from "../models/Room";
import authenticateJWT from "../middleware/authenticateJWT";
import { User } from "../models/userModel"; // User 인터페이스 임포트

interface AuthRequest extends Request {
  user?: User;
}

const router = express.Router();

// GET /rooms - 모든 방 목록 조회
router.get(
  "/rooms",
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rooms: Room[] = await getRooms();
      res.json({ rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  }
);

// POST /rooms - 새로운 방 생성
router.post(
  "/rooms",
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { roomName } = req.body;
    const userId = req.user?.user_id; // req.user의 user_id 사용

    // userId가 없거나 roomName이 없을 때 에러 처리 및 반환
    if (!roomName) {
      res.status(400).json({ message: "방 이름이 필요합니다." });
    }

    if (!userId) {
      console.error("유효하지 않은 사용자: userId가 undefined입니다.");
      res.status(400).json({ message: "유효하지 않은 사용자입니다." });
    }

    try {
      const newRoom = await addRoom(roomName, userId as string); // userId가 이제 string으로 보장됨
      res.status(201).json({ room: newRoom });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "방 생성에 실패했습니다." });
    }
  }
);

// DELETE /rooms/:roomId - 방 삭제
router.delete(
  "/rooms/:roomId",
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { roomId } = req.params;
      await removeRoom(roomId);
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ error: "Failed to delete room" });
    }
  }
);

export default router;
