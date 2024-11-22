// src/routes/geulRoutes.ts
import { Router } from "express";
import { getGeulByUserId } from "../controllers/geulController";

const router = Router();

// user_id를 기반으로 geul 데이터 조회
router.get("/api/geuls/:user_id", getGeulByUserId);

export default router;
