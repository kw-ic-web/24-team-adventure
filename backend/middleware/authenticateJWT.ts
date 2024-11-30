import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { JWT_SECRET } from "../config/keys";
import { fetchUserFromSupabase } from "../services/userService"; // 함수 가져오기
import { User } from "../models/userModel";

interface UserPayload {
  user_id: string; // JWT 토큰에 저장된 user_id
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log("JWT 토큰:", token); // 토큰 로그 추가
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // JWT 토큰을 검증하여 decoded 값 얻기
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    // console.log("Decoded JWT:", decoded); // 디코딩된 JWT 정보 로그 추가
    // Supabase에서 user_id로 사용자 정보 조회
    const user = await fetchUserFromSupabase(decoded.user_id);
    // console.log("Fetched User from Supabase:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // 요청 객체에 사용자 정보 저장
    next();
  } catch (error) {
    // JWT 토큰 검증 실패 시
    // console.error("Authentication Error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticateJWT;
