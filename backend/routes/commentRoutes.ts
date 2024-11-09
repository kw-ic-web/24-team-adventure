import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// 댓글 목록 조회 라우트
router.get(
  "/board/:story_id/post/:geul_id/comments",
  async (req: Request, res: Response): Promise<void> => {
    const { story_id, geul_id } = req.params;

    if (
      !story_id ||
      isNaN(parseInt(story_id)) ||
      !geul_id ||
      isNaN(parseInt(geul_id))
    ) {
      console.error("Invalid story_id or geul_id:", story_id, geul_id);
      res
        .status(400)
        .json({ error: "유효하지 않은 story_id 또는 geul_id입니다." });
      return; // 함수 종료
    }

    try {
      const result = await pool.query(
        "SELECT * FROM comment WHERE geul_id = $1 ORDER BY created_at ASC",
        [parseInt(geul_id)]
      );
      res.json(result.rows); // 응답 전송
    } catch (err) {
      console.error("Error fetching comments:", err);
      res
        .status(500)
        .json({ error: "댓글 데이터를 불러오는 데 실패했습니다." });
    }
  }
);

export default router;
