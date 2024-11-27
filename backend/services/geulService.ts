// src/services/geulService.ts
import supabase from "../config/supabaseClient";

// Supabase에서 user_id로 geul 데이터 조회
export async function fetchGeulByUserId(user_id: string) {
  console.log("Supabase에서 geul 데이터 조회 중:", user_id); // 전달된 user_id 로그
  const { data, error } = await supabase
    .from("geul")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.log("Supabase 오류:", error); // 오류 메시지 로그
    throw new Error("Failed to fetch geul data from Supabase");
  }

  if (!data || data.length === 0) {
    console.log("Supabase에서 해당 user_id로 geul 데이터 없음");
    return [];
  }

  console.log("Supabase에서 조회된 geul 데이터:", data);
  return data;
}
