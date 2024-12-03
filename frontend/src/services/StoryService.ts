import api from '../api'; // Axios 인스턴스 임포트

// 서버로 스토리 진행 요청을 보내는 함수
export const generateStoryContinuation = async (userInput: string) => {
  try {
    const response = await api.post('/api/generate-story-first', { userInput });
    return response.data; // 서버에서 반환된 데이터 (연속된 이야기와 키워드)
  } catch (error) {
    console.error('Error generating story continuation:', error);
    throw new Error('스토리 연속 생성에 실패했습니다.');
  }
};

export const generateStoryContinuation_second = async (userInput: string) => {
  try {
    const response = await api.post('/api/generate-story-second', {
      userInput,
    });
    return response.data; // 서버에서 반환된 데이터 (연속된 이야기와 키워드)
  } catch (error) {
    console.error('Error generating second story continuation:', error);
    throw new Error('중간 스토리 연속 생성에 실패했습니다.');
  }
};

export const generateStoryContinuation_end = async (userInput: string) => {
  try {
    const response = await api.post('/api/generate-story-end', { userInput });
    return response.data; // 서버에서 반환된 데이터 (연속된 이야기와 키워드)
  } catch (error) {
    console.error('Error generating end story continuation:', error);
    throw new Error('결말 스토리 연속 생성에 실패했습니다.');
  }
};
export const generateStoryKeywords = async (userInput: string) => {
  try {
    const response = await api.post('/api/generate-keywords', { userInput });
    return response.data; // 서버에서 반환된 데이터 (연속된 이야기와 키워드)
  } catch (error) {
    console.error('Error generating keywords:', error);
    throw new Error('키워드 생성에 실패했습니다.');
  }
};
export const generateStoryImage = async (userInput: string) => {
  try {
    const response = await api.post('/api/generate-image', { userInput });
    return response.data; // 서버에서 반환된 데이터 (연속된 이야기와 키워드)
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('이미지 생성에 실패했습니다.');
  }
};
