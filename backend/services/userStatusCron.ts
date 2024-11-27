import cron from "node-cron";
import { markInactiveUsersOffline } from "../services/userStatusService";

// 1분마다 유휴 사용자 오프라인 처리 실행
cron.schedule("*/1 * * * *", async () => {
  console.log("Running scheduled task: mark inactive users offline...");
  await markInactiveUsersOffline();
});
