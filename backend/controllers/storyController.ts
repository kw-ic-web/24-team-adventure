// /backend/controllers/storyController.ts
import { generateStoryContinuation } from '../services/storyService';

export const generateStory = async (req, res) => {
  const { userInput } = req.body; //클라이언트에서 post한 거 받아옴

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const result = await generateStoryContinuation(userInput);//back/storyService의 스토리생성함수호출
    return res.json(result);
  } catch (error) {
    console.error('Error generating story continuation:', error);
    return res.status(500).json({ error: 'Error generating story continuation' });
  }
};
