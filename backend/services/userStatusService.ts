import supabase from "../config/supabaseClient";

export const markInactiveUsersOffline = async (): Promise<void> => {
  try {
    // 현재 시간 기준으로 5분 전 시간 계산 (ISO 8601 형식 변환)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("user")
      .update({ online: false }) // 온라인 상태를 오프라인으로 변경
      .lt("updated_at", fiveMinutesAgo) // 5분 전 시간 기준
      .eq("online", true); // 현재 온라인 상태인 사용자만 선택

    if (error) throw error;

    console.log("Inactive users updated:", data);
  } catch (err) {
    console.error("Error updating inactive users:", err);
  }
};
