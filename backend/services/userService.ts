// src/services/userService.ts
import supabase from "../config/supabaseClient";

// Supabase에 새 사용자 추가
export async function createUserInSupabase(
  googleUserId: string,
  email: string | undefined,
  name: string | undefined,
  picture: string | undefined
) {
  const { data, error } = await supabase
    .from("user")
    .insert([
      {
        user_id: googleUserId,
        email: email,
        name: name,
        icon: picture,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Failed to create user in Supabase");
  return data;
}

// Supabase에서 user_id로 사용자 정보 조회
export async function fetchUserFromSupabase(user_id: string) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.log("Supabase error:", error);
    throw error;
  }

  return data || null;
}
