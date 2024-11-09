import { generateStoryContinuation } from '../services/storyService';
import { generateKeywords } from '../services/storyService';

// 스토리 생성
export const generateStory = async (req, res) => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const storyResult = await generateStoryContinuation(userInput); // 스토리 생성
    return res.json({ continuation: storyResult.continuation }); // 생성된 스토리만 반환
  } catch (error) {
    console.error('Error generating story continuation:', error);
    return res.status(500).json({ error: 'Error generating story continuation' });
  }
};

// 키워드 생성
export const generateStoryKeywords = async (req, res) => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const keywords = await generateKeywords(userInput); // 키워드 생성
    return res.json({ keywords }); // 생성된 키워드만 반환
  } catch (error) {
    console.error('Error generating keywords:', error);
    return res.status(500).json({ error: 'Error generating keywords' });
  }
};