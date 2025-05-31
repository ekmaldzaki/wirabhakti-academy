"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WelcomeCardPelatih() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("pelatih_profiles")
        .select("nama_lengkap, cabang_olahraga")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-full mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Halo, {profile?.nama_lengkap || "Pelatih"}!
      </h2>
      <div className="space-y-2 text-gray-800">
        <p>
          <span className="font-semibold">Cabang Olahraga:</span>{" "}
          {profile?.cabang_olahraga || "-"}
        </p>
      </div>
    </div>
  );
}
