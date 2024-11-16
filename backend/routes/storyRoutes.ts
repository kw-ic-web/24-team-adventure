// backend/routes/storyRoutes.ts
import express from "express";
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
export default router;
