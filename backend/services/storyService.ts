// /backend/services/storyService.ts
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

//gpt api 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

//gpt 내용 생성
export const generateStoryContinuation = async (userInput: string) => {
  try {
    if (!openai || !openai.chat || !openai.chat.completions) {
      throw new Error("openai 객체가 제대로 초기화되지 않았습니다.");
    }
    console.log("GPT API 요청 중...");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a storyteller.(no other explanations. only the story). Give me 2 paragraphs that has each 2 sentences. don't make a conclusion.(in korean)",
        },
        { role: "user", content: `The story so far: ${userInput}` },
      ],
    });

    const continuation = response?.choices?.[0]?.message?.content;
    return { continuation }; // 이야기 연속성만 반환
  } catch (error) {
    console.error("Error generating story continuation:", error);
    return { error };
  }
};

//결말 내용 생성
export const generateStoryContinuation_end = async (userInput: string) => {
  try {
    if (!openai || !openai.chat || !openai.chat.completions) {
      throw new Error("openai 객체가 제대로 초기화되지 않았습니다.");
    }
    console.log("GPT API 요청 중...");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a storyteller.(no other explanations. only the story). Give me 2 paragraphs that has each 2 sentences.  make a conclusion.This will be the end of the story. (Use korean)",
        },
        { role: "user", content: `The story so far: ${userInput}` },
      ],
    });

    const continuation = response?.choices?.[0]?.message?.content;
    return { continuation }; // 이야기 연속성만 반환
  } catch (error) {
    console.error("Error generating story continuation:", error);
    return { error };
  }
};

//gpt가 키워드 3개 생성
export const generateStoryKeywords = async (userInput: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a storyteller." },
        {
          role: "user",
          content: `Generate 3 related keywords for the following story(Give me exactly 3 related keywords with no explanation): ${userInput}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content.split(",").map((keyword: string) => keyword.trim()); // keyword: string
    }
    return [];
  } catch (error) {
    console.error("Error generating keywords:", error);
    return [];
  }
};

//이미지 생성
export const generateStoryImage = async (userInput: string) => {
  try {
    // OpenAI 이미지 생성 API 호출
    //const prompt = `Create an image of this scene(It's a storybook for kids. Use drawings/paintings. not like pictures): ${userInput}, use specific details like characters, setting, and mood in this given story.`;
    //const prompt = `Create an illustration for a children's storybook. The scene should depict Snow White and the Queen in a friendly, peaceful conversation. The setting is a vibrant, magical forest with colorful flowers and trees. Snow White should be wearing a beautiful white dress, and the Queen is in a regal outfit, both smiling and interacting in a warm and joyful atmosphere. The style should be whimsical, hand-drawn, and suitable for a children's storybook.`;

    const response = await openai.images.generate({
      // model: "dall-e", // 사용할 모델
      prompt: `Create an image of this scene(It's a storybook for kids. Use drawings/paintings. not like pictures): ${userInput}, use specific details like characters, setting, and mood in this given story.`,
    // 생성할 이미지의 설명
      n: 1, // 생성할 이미지 개수
      size: "1024x1024", // 이미지 크기
    });
    const imageUrl = response.data[0]?.url; // 생성된 이미지 URL
    if (imageUrl) {
      return imageUrl;
    }
    return "";
  } catch (error) {
    console.error("이미지 생성 중 에러 발생:", error);
    return ""; // 에러 발생 시 빈 문자열 반환
  }
};
