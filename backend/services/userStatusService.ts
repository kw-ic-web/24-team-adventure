import supabase from "../config/supabaseClient";

export const markInactiveUsersOffline = async (): Promise<void> => {
  try {
    const MinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("user")
      .update({ online: false })
      .lt("updated_at", MinutesAgo)
      .eq("online", true);

    if (error) throw error;

    console.log("Inactive users updated:", data);
  } catch (err) {
    console.error("Error updating inactive users:", err);
  }
};
