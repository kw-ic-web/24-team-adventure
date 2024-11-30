// src/routes/protectedRoutes.ts
// 일단 넣은 코드
import express, { Request, Response } from "express";
import authenticateJWT from "../middleware/authenticateJWT";
import { User } from "../models/userModel";

// `Request` 객체에서 `user`의 타입을 지정
interface AuthenticatedRequest extends Request {
  user?: User; // `req.user`가 `User` 타입임을 명시적으로 지정
}

const router = express.Router();

router.get(
  "/api/user",
  authenticateJWT,
  (req: AuthenticatedRequest, res: Response) => {
    if (req.user) {
      // console.log("Returning user data:", req.user); // 응답 전에 사용자 정보 로그
      res.json({ message: "Protected data", user: req.user });
    } else {
      // console.log("User not found in request");
      res.status(403).json({ message: "Access denied" });
    }
  }
);

export default router;
