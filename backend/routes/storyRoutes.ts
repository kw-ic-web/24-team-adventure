//동화 관련 routes
// /backend/routes/storyRoutes.ts
import express from 'express';
import { generateStory } from '../controllers/storyController';

const router = express.Router();

router.post('/generate-story', generateStory);

export default router;