// backend/routes/storyRoutes.ts
import express, { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import dotenv from "dotenv";
dotenv.config();
import {
  generateStory,
  generateStory_end,
  generateKeywords,
  generateImage,
} from "../controllers/storyController"; // 각 함수 가져오기

const router = express.Router();

router.post("/api/generate-story", generateStory);
router.post("/api/generate-story", generateStory_end);
router.post("/api/generate-keywords", generateKeywords);
router.post("/api/generate-image", generateImage);

// gameplay에서 데이터를 가져오는 API
router.get("/stories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("story")
      .select("story_id, story_title, cover_pic, intro1, intro2, intro3")
      .order("story_id", { ascending: true });

    if (error) throw error; // 에러 처리

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch stories." });
  }
});

//gameselect 관련
router.get("/stories/select", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("story")
      .select("story_id, story_title, cover_pic")
      .order("story_id", { ascending: true });

    if (error) throw error; // 에러 처리

    res.status(200).json(data); // 배열만 반환
  } catch (error) {
    console.error("Error fetching minimal stories:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch minimal stories." });
  }
});
export default router;
