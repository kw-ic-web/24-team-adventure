// /frontend/src/services/StoryService.ts
import axios from 'axios';

// 서버로 스토리 진행 요청을 보내는 함수
export const generateStoryContinuation = async (userInput: string) => {
  try {
    const response = await axios.post('/api/generate-story', { userInput });
    return response.data; // 서버에서 반환된 데이터 (연속된 이야기와 키워드)
  } catch (error) {
    console.error('Error generating story continuation:', error);
    throw new Error('스토리 연속 생성에 실패했습니다.');
  }
};
