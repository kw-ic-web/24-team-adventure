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

  // console.log("Supabase에서 사용자 조회 중:", user_id); // 전달된 user_id 로그

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

// 사용자 정보를 user_id로 가져오는 함수 추가
export async function getUserById(user_id: string) {
  try {
    const user = await fetchUserFromSupabase(user_id);
    if (!user) {
      console.log("사용자를 찾을 수 없습니다.");
      return null;
    }
    return user;
  } catch (error) {
    console.error("getUserById 오류:", error);
    return null;
  }
}
