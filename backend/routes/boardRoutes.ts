import { Router, Request, Response } from "express";
import supabase from "../config/supabaseClient";

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
    const { data, error } = await supabase
      .from("geul")
      .select("*")
      .eq("story_id", parseInt(story_id));

    if (error) throw error;
    res.json(data);
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
    const { data, error } = await supabase
      .from("geul")
      .select("*")
      .order("uploaded_time", { ascending: false });

    if (error) throw error;
    res.json(data);
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
      // geul 데이터 가져오기
      const { data: geulData, error: geulError } = await supabase
        .from("geul")
        .select("*")
        .eq("story_id", parseInt(story_id))
        .eq("geul_id", parseInt(geul_id))
        .single();

      if (geulError || !geulData) {
        console.error("Error fetching geul data:", geulError?.message);
        res
          .status(500)
          .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
        return;
      }

      // story 데이터 가져오기
      const { data: storyData, error: storyError } = await supabase
        .from("story")
        .select("intro1, intro2, intro3")
        .eq("story_id", parseInt(story_id))
        .single();

      if (storyError || !storyData) {
        console.error("Error fetching story data:", storyError?.message);
        res
          .status(500)
          .json({ error: "스토리 데이터를 불러오는 데 실패했습니다." });
        return;
      }

      // geulData와 storyData를 합쳐서 응답 데이터 생성
      const responseData = {
        ...geulData,
        ...storyData,
      };

      res.json(responseData);
    } catch (err) {
      console.error("Error fetching post:", err);
      res
        .status(500)
        .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
    }
  }
);

export default router;
