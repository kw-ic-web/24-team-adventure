import { Router, Request, Response } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

// 댓글 목록 조회 라우트
router.get(
  "/board/:story_id/post/:geul_id/comments",
  async (req: Request, res: Response): Promise<void> => {
    const { geul_id } = req.params;

    if (!geul_id || isNaN(parseInt(geul_id))) {
      console.error("Invalid geul_id:", geul_id);
      res.status(400).json({ error: "유효하지 않은 geul_id입니다." });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("comment")
        .select("comment_id, user_id, comm_content, created_at")
        .eq("geul_id", geul_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error.message);
        res
          .status(500)
          .json({ error: "댓글 데이터를 불러오는 데 실패했습니다." });
        return;
      }

      if (!data || data.length === 0) {
        res.status(404).json({ error: "댓글이 없습니다." });
        return;
      }

      res.json(data);
    } catch (err) {
      console.error("Unexpected error:", err);
      res
        .status(500)
        .json({ error: "댓글 데이터를 불러오는 데 실패했습니다." });
    }
  }
);

// 댓글 추가 라우트
router.post(
  "/board/:story_id/post/:geul_id/comments",
  async (req: Request, res: Response): Promise<void> => {
    const { geul_id } = req.params;
    const { user_id, comm_content } = req.body;

    if (!geul_id || isNaN(parseInt(geul_id))) {
      console.error("Invalid geul_id:", geul_id);
      res.status(400).json({ error: "유효하지 않은 geul_id입니다." });
      return;
    }

    if (!user_id || !comm_content) {
      res.status(400).json({ error: "user_id와 comm_content가 필요합니다." });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("comment")
        .insert([
          {
            geul_id: parseInt(geul_id),
            user_id,
            comm_content,
            created_at: new Date(),
          },
        ])
        .select("comment_id, user_id, comm_content, created_at");

      if (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ error: "댓글 추가에 실패했습니다." });
        return;
      }

      if (!data || data.length === 0) {
        console.error("No data returned after inserting comment.");
        res.status(500).json({ error: "댓글 추가에 실패했습니다." });
        return;
      }

      res
        .status(201)
        .json({ message: "댓글이 추가되었습니다.", data: data[0] });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "댓글 추가에 실패했습니다." });
    }
  }
);

// 댓글 삭제 라우트
router.delete(
  "/board/:story_id/post/:geul_id/comments/:comment_id",
  async (req: Request, res: Response): Promise<void> => {
    const { comment_id } = req.params;

    if (!comment_id || isNaN(parseInt(comment_id))) {
      console.error("Invalid comment_id:", comment_id);
      res.status(400).json({ error: "유효하지 않은 comment_id입니다." });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("comment")
        .delete()
        .eq("comment_id", parseInt(comment_id))
        .select("comment_id, user_id, comm_content, created_at");

      if (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ error: "댓글 삭제에 실패했습니다." });
        return;
      }

      if (!data || data.length === 0) {
        res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
        return;
      }

      res
        .status(200)
        .json({ message: "댓글이 삭제되었습니다.", data: data[0] });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "댓글 삭제에 실패했습니다." });
    }
  }
);

export default router;
