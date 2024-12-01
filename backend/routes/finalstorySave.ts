import { Router, Request, Response } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

interface StoryRequest {
  user_id: string;
  story_id: string;
  geul_title: string;
  geul_content: string;
}

router.post(
  "/api/saveStory",
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Story save request received:", req.body);
      const { user_id, story_id, geul_title, geul_content } = req.body;

      // 데이터 검증
      if (!user_id || !story_id || !geul_title || !geul_content) {
        res.status(400).json({ error: "필수 필드가 누락되었습니다." });
        return;
      }

      // Supabase 데이터 삽입
      const { data, error } = await supabase
        .from("geul")
        .insert([
          {
            user_id,
            story_id,
            geul_title,
            geul_content,
            uploaded_time: new Date().toISOString(),
          },
        ])
        .select("geul_id, user_id, story_id, geul_title, geul_content");

      // 에러 처리
      if (error) {
        console.error("Supabase 에러:", error.message);
        res.status(500).json({ error: "스토리 저장 중 오류가 발생했습니다." });
        return;
      }

      // 성공 응답
      res.status(201).json({
        message: "스토리가 성공적으로 저장되었습니다.",
        data: data[0],
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  }
);

export default router;
