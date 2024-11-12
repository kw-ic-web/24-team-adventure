//authRoutes.ts
import express from "express";
import { verifyGoogleToken } from "./google";

const router = express.Router();

router.post("/google", async (req, res) => {
  const { token } = req.body;
  try {
    const payload = await verifyGoogleToken(token);
    if (payload) {
      const { sub, name, email } = payload;
      res.json({ user: { id: sub, name, email } });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
