"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WelcomeCardSiswa() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("siswa_profiles")
        .select("nama_lengkap, tempat_tanggal_lahir, cabang_olahraga, posisi")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Selamat Datang, {profile?.nama_lengkap || "Siswa"}!
      </h2>
      <div className="space-y-2 text-gray-800">
        <p>
          <span className="font-semibold">TTL:</span>{" "}
          {profile?.tempat_tanggal_lahir || "-"}
        </p>
        <p>
          <span className="font-semibold">Cabang Olahraga:</span>{" "}
          {profile?.cabang_olahraga || "-"}
        </p>
        <p>
          <span className="font-semibold">Posisi:</span>{" "}
          {profile?.posisi || "-"}
        </p>
      </div>
    </div>
  );
}
