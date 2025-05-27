import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export const useRoleGuard = (
  allowedRoles: string[],
  redirectTo: string = "/login"
) => {
  const router = useRouter();

  useEffect(() => {
    const validate = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(redirectTo);
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!roleData || !allowedRoles.includes(roleData.role)) {
        router.push(redirectTo);
      }
    };

    validate();
  }, [allowedRoles, redirectTo, router]);
};
