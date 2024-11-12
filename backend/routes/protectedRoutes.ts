// src/routes/protectedRoutes.ts
import express, { Request, Response } from "express";
import authenticateJWT from "../middleware/authenticateJWT";
import { User } from "../models/userModel";

// `Request` 객체에서 `user`의 타입을 지정
interface AuthenticatedRequest extends Request {
  user?: User; // `req.user`가 `User` 타입임을 명시적으로 지정
}

const router = express.Router();

// `/protected` 엔드포인트
router.get(
  "/protected",
  authenticateJWT,
  (req: AuthenticatedRequest, res: Response) => {
    if (req.user) {
      res.json({ message: "Protected data", user: req.user });
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  }
);

export default router;
