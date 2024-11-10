import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// 특정 story_id의 게시물 목록 조회 라우트
router.get("/board/:story_id", async (req: Request, res: Response) => {
  const { story_id } = req.params;
  if (!story_id || isNaN(parseInt(story_id))) {
    console.error("Invalid story_id:", story_id);
    res.status(400).json({ error: "유효하지 않은 story_id입니다." });
    return;
  }
  try {
    const result = await pool.query("SELECT * FROM geul WHERE story_id = $1", [
      parseInt(story_id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
  }
});

// 모든 게시물 최신순 조회 라우트
router.get("/posts", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM geul ORDER BY uploaded_time DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
  }
});

// 게시물 상세 조회 라우트
router.get(
  "/board/:story_id/post/:geul_id",
  async (req: Request, res: Response) => {
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
      return;
    }
    try {
      const result = await pool.query(
        "SELECT * FROM geul WHERE story_id = $1 AND geul_id = $2",
        [parseInt(story_id), parseInt(geul_id)]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
        return;
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error fetching post:", err);
      res
        .status(500)
        .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
    }
  }
);

export default router;
