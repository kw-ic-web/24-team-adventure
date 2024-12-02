// backend/middleware/authenticateJWT.ts

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/keys";
import { fetchUserFromSupabase } from "../services/userService"; // 함수 가져오기
import { User } from "../models/userModel";

interface UserPayload extends JwtPayload {
  user_id: string; // JWT 토큰에 저장된 user_id
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// JWT_SECRET이 정의되어 있는지 확인
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("JWT 토큰:", token); // 토큰 로그 추가

  if (!token) {
    res.status(403).json({ message: "Access denied: No token provided" });
    return; // 함수 실행 중단
  }

  try {
    // JWT 토큰을 검증하여 decoded 값 얻기
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as UserPayload;
    console.log("Decoded JWT:", decoded); // 디코딩된 JWT 정보 로그 추가

    if (!decoded.user_id) {
      res.status(403).json({ message: "Invalid token: user_id is missing" });
      return;
    }

    // Supabase에서 user_id로 사용자 정보 조회
    const user = await fetchUserFromSupabase(decoded.user_id);
    console.log("Fetched User from Supabase:", user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user; // 요청 객체에 사용자 정보 저장
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};

export default authenticateJWT;
