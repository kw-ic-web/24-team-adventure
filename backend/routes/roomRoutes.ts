// backend/routes/roomRoutes.ts

import express, { Request, Response } from "express";
import { getRooms, addRoom, removeRoom } from "../services/roomService";
import { Room } from "../models/Room";

const router = express.Router();

// GET /rooms - 모든 방 목록 조회
router.get("/rooms", async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms: Room[] = await getRooms();
    res.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// POST /rooms - 새로운 방 생성
router.post("/rooms", async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomName, userId } = req.body;

    // 필수 필드 검증
    if (!roomName || !userId) {
      console.error("Missing roomName or userId:", { roomName, userId });
      res.status(400).json({ error: "roomName과 userId는 필수입니다." });
      return;
    }

    const newRoom: Room = await addRoom(roomName, userId);
    res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// DELETE /rooms/:roomId - 방 삭제
router.delete(
  "/rooms/:roomId",
  async (req: Request, res: Response): Promise<void> => {
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
