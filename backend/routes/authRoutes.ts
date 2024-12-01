import { GOOGLE_CLIENT_ID, JWT_SECRET } from "../config/keys"; // 환경변수 불러오기
import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
const jwt = require("jsonwebtoken");
import {
  fetchUserFromSupabase,
  createUserInSupabase,
} from "../services/userService";

// Google 인증 클라이언트 초기화
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const router = express.Router();

// POST /api/auth/google
router.post(
  "/api/auth/google",
  async (req: Request, res: Response): Promise<any> => {
    const { token } = req.body; // 클라이언트에서 받은 Google OAuth2 토큰
    // console.log("구글 인증 토큰 수신:", token);
    try {
      // 1. Google 토큰을 검증
      // console.log("Google 토큰 검증 중...");
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID, // 클라이언트 ID를 지정하여 토큰을 검증
      });
      // console.log("Google 토큰 검증 완료");
      //2. 검증된 사용자 정보
      const payload = ticket.getPayload();
      if (!payload) {
        // console.log("검증된 사용자 정보 없음");
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 사용자 정보 출력
      // console.log("검증된 사용자 정보:", payload);

      // 3. Google OAuth에서 받은 user_id와 Supabase에서 가져온 user_id를 비교
      const googleUserId = payload.sub; // Google OAuth에서 받은 user_id
      // console.log("Google user_id:", googleUserId);

      // 4. Supabase에서 사용자 정보 조회 (user_id 비교)
      let user = await fetchUserFromSupabase(googleUserId);
      // console.log("Supabase에서 조회된 사용자 정보:", user);
      let isNewUser = false;
      // 5. 유저가 없으면 새로운 유저로 등록
      if (!user) {
        isNewUser = true;
        console.log("Supabase에서 사용자 정보 없음");
        user = await createUserInSupabase(
          googleUserId,
          payload.email,
          payload.name,
          payload.picture
        ); // 새 유저 생성
      }

      // 6. JWT 생성 (서버에서 인증된 사용자를 위한 토큰)
      const jwtToken = jwt.sign(
        { user_id: user.user_id },
        JWT_SECRET,
        { expiresIn: "1h" } // 1시간 동안 유효한 토큰
      );

      // 7. 성공적인 인증 후 JWT 토큰을 반환
      res.json({
        user: { id: user.user_id },
        token: jwtToken,
        isNewUser,
      });
    } catch (error) {
      console.error("Google Authentication Error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  }
);

export default router;
