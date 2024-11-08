// /backend/services/storyService.ts
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

//gpt api 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

//userinput에 뭐 들어가는 지 제대로 설정하고 db저장 관리
//기존내용과 새로 생성된 내용까지 userinput에 한꺼번에 넣어야할듯
//키워드생성도 모든 내용포함된 userinput갖고 만든다는 거 다시 고려해봐야함

//gpt가 다음 내용 생성
export const generateStoryContinuation = async (userInput: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a storyteller.(no other explanations. only the story)' },
          { role: 'user', content: `The story so far: ${userInput}` },
        ],
      });
  
      const continuation = response.choices[0]?.message?.content;
  
      return { continuation }; // 이야기 연속성만 반환
    } catch (error) {
      console.error('Error generating story continuation:', error);
      return { continuation: '생성내용: 다시 시도해주세요.' };
    }
  };
  
  //gpt가 키워드 3개 생성 
  export const generateKeywords = async (userInput: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a storyteller.' },
          { role: 'user', content: `Generate 3 related keywords for the following story(Give me exactly 3 related keywords with no explanation): ${userInput}` },
        ],
      });
  
      const content = response.choices[0]?.message?.content;
      if (content) {
        return content.split(',').map((keyword) => keyword.trim());
      }
      return [];
    } catch (error) {
      console.error('Error generating keywords:', error);
      return [];
    }
  };
  
