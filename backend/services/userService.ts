// src/services/userService.ts
import supabase from "../config/supabaseClient";
// Supabase에서 user_id로 사용자 정보 조회
export async function fetchUserFromSupabase(user_id: string) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error || !data) throw new Error("User not found");
  return data;
}
