// src/controllers/geulController.ts
import { Request, Response } from "express";
import { fetchGeulByUserId } from "../services/geulService";

export async function getGeulByUserId(
  req: Request,
  res: Response
): Promise<void> {
  const { user_id } = req.params;
  console.log("Received user_id:", req.params.user_id); // user_id 확인
  if (!user_id) {
    res.status(400).json({ error: "user_id가 필요합니다." });
    return;
  }

  try {
    const geulData = await fetchGeulByUserId(user_id);

    if (!geulData) {
      res
        .status(404)
        .json({ message: "해당 user_id에 대한 데이터가 없습니다." });
      return;
    }

    res.status(200).json({ geul: geulData });
  } catch (error) {
    console.error("geul 데이터 조회 중 오류 발생:", error);
    res.status(500).json({ error: "geul 데이터 조회 중 오류가 발생했습니다." });
  }
}
