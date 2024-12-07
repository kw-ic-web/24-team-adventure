import { Request, Response, RequestHandler } from "express";
import {
  generateStoryContinuation,
  generateStoryContinuation_second,
  generateStoryContinuation_end,
  generateStoryTitle,
  generateStoryKeywords,
  generateStoryImage,
} from "../services/storyService";

// 스토리 생성
export const generateStory: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기
  if (!userInput) {
    res.status(400).json({ error: "User input is required" });
    return;
  }

  try {
    console.log("Received userInput:", userInput);
    const storyResult = await generateStoryContinuation(userInput); // 스토리 생성
    res.json({ continuation: storyResult.continuation }); // 생성된 스토리만 반환
  } catch (error) {
    console.error("Error generating story continuation:", error);
    res.status(500).json({ error: "Error generating story continuation" });
  }
};

export const generateStory_second: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기
  if (!userInput) {
    res.status(400).json({ error: "User input is required" });
    return;
  }

  try {
    console.log("Received userInput:", userInput);
    const storyResult = await generateStoryContinuation_second(userInput); // 스토리 생성
    res.json({ continuation: storyResult.continuation }); // 생성된 스토리만 반환
  } catch (error) {
    console.error("Error generating story continuation:", error);
    res.status(500).json({ error: "Error generating story continuation" });
  }
};

export const generateStory_end: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기
  if (!userInput) {
    res.status(400).json({ error: "User input is required" });
    return;
  }

  try {
    console.log("Received userInput:", userInput);
    const storyResult = await generateStoryContinuation_end(userInput); // 스토리 생성
    res.json({ continuation: storyResult.continuation }); // 생성된 스토리만 반환
  } catch (error) {
    console.error("Error generating story continuation:", error);
    res.status(500).json({ error: "Error generating story continuation" });
  }
};



export const generateTitle: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기
  if (!userInput) {
    res.status(400).json({ error: "User input is required" });
    return;
  }

  try {
    console.log("제목: Received userInput:", userInput);
    const titleResult = await generateStoryTitle(userInput); // 스토리 생성
    console.log("제목 생성 결과:", titleResult);
    
    res.json({ continuation: titleResult.continuation }); // 생성된 스토리만 반환
  } catch (error) {
    console.error("Error generating story title1:", error);
    res.status(500).json({ error: "Error generating story title" });
  }
};

// 키워드 생성
export const generateKeywords: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기

  if (!userInput) {
    res.status(400).json({ error: "User input is required" });
    return;
  }

  try {
    const keywords = await generateStoryKeywords(userInput); // 키워드 생성
    res.json({ keywords }); // 생성된 키워드만 반환
  } catch (error) {
    console.error("Error generating keywords:", error);
    res.status(500).json({ error: "Error generating keywords" });
  }
};

export const generateImage: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userInput } = req.body; // 클라이언트에서 post한 데이터 받아오기

  if (!userInput) {
    res.status(400).json({ error: "User input is required" });
    return;
  }

  try {
    const imageUrl = await generateStoryImage(userInput);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
};
