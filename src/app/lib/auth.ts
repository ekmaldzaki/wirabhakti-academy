import { supabase } from "./supabase";

export const getCurrentUserAndRole = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null, profile: null };

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!roleData) return { user, role: null, profile: null };

  const table =
    roleData.role === "siswa"
      ? "siswa_profiles"
      : roleData.role === "pelatih"
      ? "pelatih_profiles"
      : null;

  let profile = null;
  if (table) {
    const { data: profileData } = await supabase
      .from(table)
      .select("*")
      .eq("id", user.id)
      .single();

    profile = profileData;
  }

  return {
    user,
    role: roleData.role,
    profile,
  };
};
