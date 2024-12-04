import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

//gpt api 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

//발단: 제공, 전개:  위기 절정 ,결말: 마지막 함수

//gpt 내용 생성
export const generateStoryContinuation = async (userInput: string) => {
  try {
    if (!openai || !openai.chat || !openai.chat.completions) {
      throw new Error("openai 객체가 제대로 초기화되지 않았습니다.");
    }
    console.log("초반 내용 생성 요청");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "여기까지는 소설 구성 요소 중 발단 혹은 전개 초입부 까지의 내용입니다.이야기의 (소설 구성 요소 중)전개부터 (소설 구성 요소 중 하나인)위기 초반부까지의 이야기가 자연스럽게 이어가도록 창작하여 작성해 주세요. 다음 이야기를 350자 이내로 작성해주세요. 글자 수를 초과하지 마세요. 굳이 위기라는 것을 단어로 언급하여 문장을 구성하지 말아주세요. 내용만 위기에 처한 내용이면 됩니다.  캐릭터 이름과 설정은 제공한 텍스트와 동일하게 유지하고, 등장인물들의 대사는 간단하고 명확하게 표현해 주세요. 이야기의 흐름이 자연스럽고 스무스하게 이어지도록 신경 써 주세요. 문장과 사건의 전개가 동화책 스타일에 맞고, 내용과 단어 수준은 초등학교 3학년 수준에 맞춰 주세요. 제공한 텍스트의 상황 설정을 이어가 주세요.~했습니다 체를 사용해주세요",
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

//gpt 내용 생성
export const generateStoryContinuation_second = async (userInput: string) => {
  try {
    if (!openai || !openai.chat || !openai.chat.completions) {
      throw new Error("openai 객체가 제대로 초기화되지 않았습니다.");
    }
    console.log("중간 내용 생성 요청");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "여기까지는 소설 구성 요소 중 위기 중반부 혹은 위기 후반부 까지의 내용입니다.이야기의 (소설 구성 요소 중)절정 부분이 자연스럽게 진행되도록 창작하여 작성해 주세요. 다음 이야기를 350자 이내로 작성해주세요. 글자 수를 초과하지 마세요. 캐릭터 이름과 설정은 제공한 텍스트와 동일하게 유지하고, 등장인물들의 대사는 간단하고 명확하게 표현해 주세요. 이야기의 흐름이 자연스럽고 스무스하게 이어지도록 신경 써 주세요. 문장과 사건의 전개가 동화책 스타일에 맞고, 내용과 단어 수준은 초등학교 3학년 수준에 맞춰 주세요. 제공한 텍스트의 상황 설정을 이어가 주세요.~했습니다 체를 사용해주세요",
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
    console.log("결말 내용 생성 요청 ");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "여기까지는 소설 구성 요소 중 절정 혹은 결말 초반부 까지의 내용입니다.이야기 자연스럽게 결말지어 동화가 행복하게 끝나도록 작성해 주세요. 다음 이야기를 350자 이내로 작성해주세요. 글자 수를 초과하지 마세요. 캐릭터 이름과 설정은 제공한 텍스트와 동일하게 유지하고, 등장인물들의 대사는 간단하고 명확하게 표현해 주세요. 이야기의 흐름이 자연스럽고 스무스하게 이어지도록 신경 써 주세요. 문장과 사건의 전개가 동화책 스타일에 맞고, 내용과 단어 수준은 초등학교 3학년 수준에 맞춰 주세요. 제공한 텍스트의 상황 설정을 이어가 주세요.~했습니다 체를 사용해주세요",
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
          content: `Generate two keywords based on the text I provide, excluding the first sentence. And generate one keyword that's not in this text, but has possibility to continue the story with. (Give me exactly 3 related keywords with no explanation )(in korean) : ${userInput}`,
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
