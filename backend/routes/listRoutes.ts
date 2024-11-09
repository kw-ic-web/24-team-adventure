// 스토리 목록 조회 관련 라우트
import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/stories", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM story");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res
      .status(500)
      .json({ error: "스토리 데이터를 불러오는 데 실패했습니다." });
  }
});

export default router;
