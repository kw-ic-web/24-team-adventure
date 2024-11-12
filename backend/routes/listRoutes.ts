// 스토리 목록 조회 관련 라우트
import { Router, Request, Response } from "express";
import supabase from "../supabaseClient";

const router = Router();

router.get("/stories", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("story").select("*");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res
      .status(500)
      .json({ error: "스토리 데이터를 불러오는 데 실패했습니다." });
  }
});

export default router;
