import express, { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import authenticateJWT from "../../backend/middleware/authenticateJWT"; // JWT 인증 미들웨어

const router = express.Router();

/**
 * 1. 사용자 상태 업데이트
 * POST /api/user/status
 * Body: { online: boolean }
 */
router.post("/status", authenticateJWT, async (req: Request, res: Response) => {
  const user_id = req.user!.user_id; // JWT에서 추출한 user_id
  const { online } = req.body;

  try {
    const { error } = await supabase
      .from("user")
      .update({
        online,
        updated_at: new Date(), // 상태 변경 시 현재 시간으로 갱신
      })
      .eq("user_id", user_id);

    if (error) throw error;

    res.json({ message: "User status updated successfully." });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ message: "Failed to update user status." });
  }
});

/**
 * 2. 사용자 상태 조회
 * GET /api/user/status/:user_id
 */
router.get("/status/:user_id", async (req: Request, res: Response) => {
  const { user_id } = req.params;
  console.log("Received user_id:", user_id); // user_id 로그 추가

  try {
    const { data, error } = await supabase
      .from("user")
      .select("online, updated_at, icon, name, email")
      .eq("user_id", user_id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching user status:", err);
    res.status(500).json({ message: "Failed to fetch user status." });
  }
});

/**
 * 3. 전체 사용자 상태 조회
 * GET /api/user/status
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("user_id, online, icon, name, email");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching users' statuses:", err);
    res.status(500).json({ message: "Failed to fetch users' statuses." });
  }
});

export default router;
