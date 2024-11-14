// src/services/userService.ts
import supabase from "../config/supabaseClient";

// Supabase에 새 사용자 추가
export async function createUserInSupabase(
  googleUserId: string,
  email: string | undefined,
  name: string | undefined,
  picture: string | undefined
) {
  const { data, error } = await supabase.from("user").insert([
    {
      user_id: googleUserId,
      email: email,
      name: name,
      icon: picture,
    },
  ]);

  if (error || !data) throw new Error("Failed to create user in Supabase");
  return data[0]; // 새로 추가된 사용자 정보 반환
}

// Supabase에서 user_id로 사용자 정보 조회
export async function fetchUserFromSupabase(user_id: string) {
  console.log("Supabase에서 사용자 조회 중:", user_id); // 전달된 user_id 로그
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.log("Supabase 오류:", error); // 오류 메시지를 확인
    return null;
  }

  // 조회된 데이터가 없는 경우
  if (!data) {
    console.log("Supabase에서 해당 user_id로 사용자 데이터 없음");
    return null;
  }

  // 정상적으로 사용자 데이터를 찾은 경우
  console.log("Supabase에서 조회된 사용자 데이터:", data);
  return data;
}
