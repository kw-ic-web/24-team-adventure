// /src/services/storyService.ts

import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI 클라이언트 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// 사용자로부터 받은 문장에 기반해 GPT로 스토리 진행 요청
export const generateStoryContinuation = async (userInput: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // GPT-4 모델 사용
      messages: [
        { role: 'system', content: 'You are a storyteller.' },
        { role: 'user', content: `The story so far: ${userInput}` },
      ],
    });

    // GPT의 응답에서 두 가지 연속된 이야기 흐름 추출
    const continuation1 = response.choices[0]?.message?.content;
    const continuation2 = response.choices[1]?.message?.content;

    // 키워드 생성
    const keywords = await generateKeywords(userInput);

    return {
      continuation1,
      continuation2,
      keywords,
    };
  } catch (error) {
    console.error('Error generating story continuation:', error);
    return {
      continuation1: '생성내용1: 다시 시도해주세요.',
      continuation2: '생성내용2: 다시 시도해주세요.',
      keywords: [],
    };
  }
};

// 키워드 생성 함수
const generateKeywords = async (userInput: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a storyteller.' },
      { role: 'user', content: `Generate 3 related keywords for the following story: ${userInput}` },
    ],
  });

  const content = response.choices[0]?.message?.content;
if (content) {
  const keywords = content.split(',').map((keyword) => keyword.trim());
  return keywords;
}
return [];
};
