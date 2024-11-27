import express, { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import authenticateJWT from "../../backend/middleware/authenticateJWT"; // JWT 인증 미들웨어
import { markInactiveUsersOffline } from "../services/userStatusService"; //시간계산함

const router = express.Router();

router.post("/status", authenticateJWT, async (req: Request, res: Response) => {
  const user_id = req.user!.user_id;
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

router.post("/cleanup", async (req: Request, res: Response) => {
  try {
    await markInactiveUsersOffline();
    res.json({ message: "Inactive users processed successfully." });
  } catch (err) {
    console.error("Error cleaning up inactive users:", err);
    res.status(500).json({ message: "Failed to clean up inactive users." });
  }
});
export default router;
