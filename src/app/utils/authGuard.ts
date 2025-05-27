// utils/authGuard.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function authGuard() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { redirect: "/login" };

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || !roleData) return { redirect: "/login" };

  return {
    user,
    role: roleData.role,
  };
}
