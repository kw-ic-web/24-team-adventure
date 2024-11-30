import { io, rooms } from "../services/socketService";
import { Router, Request, Response } from "express";

const router = Router();

interface Room {
  title: string;
  participants: number;
  maxParticipants: number;
}
// 새로운 방 생성
router.post("/api/rooms", (req: Request, res: Response): void => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: "Invalid room data" });
    return;
  }

  const newroom: Room = {
    title,
    participants: 0,
    maxParticipants: 2,
  };
  rooms.push(newroom);
  io.emit("roomUpdated", rooms); // 모든 클라이언트에 업데이트된 방 목록 브로드캐스트
  res.status(201).json(newroom);
});
export default router;
