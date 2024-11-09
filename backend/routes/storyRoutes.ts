import express from "express";
import {
  generateStory,
  generateStoryKeywords,
} from "../controllers/storyController"; // 각 함수 가져오기

const router = express.Router();

// 사용자가 입력한 문장을 기반으로 스토리 진행 생성
router.post("/generate-story", generateStory);

// 사용자가 입력한 문장을 기반으로 키워드 생성
router.post("/generate-keywords", generateStoryKeywords);

export default router;
