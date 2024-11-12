import { GOOGLE_CLIENT_ID, JWT_SECRET } from "../config/keys"; // 환경변수 불러오기
import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
const jwt = require("jsonwebtoken");

// Google 인증 클라이언트 초기화
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const router = express.Router();

// POST /api/auth/google
router.post(
  "auth/google",
  async (req: Request, res: Response): Promise<any> => {
    const { token } = req.body; // 클라이언트에서 받은 Google OAuth2 토큰

    try {
      // Google 토큰을 검증
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID, // 클라이언트 ID를 지정하여 토큰을 검증
      });

      // 검증된 사용자 정보
      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 사용자 정보 추출 (필요한 경우 추가 정보 저장)
      const { sub, name, email } = payload;

      // JWT 생성 (서버에서 인증된 사용자를 위한 토큰)
      const jwtToken = jwt.sign({ sub, name, email }, JWT_SECRET, {
        expiresIn: "1h", // 1시간 동안 유효한 토큰
      });

      // 성공적인 인증 후 JWT 토큰을 반환
      res.json({ user: { id: sub, name, email }, token: jwtToken });
    } catch (error) {
      console.error("Google Authentication Error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  }
);

export default router;
