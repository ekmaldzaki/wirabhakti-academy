"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WelcomeCardSiswa() {
  const [nama, setNama] = useState("");

  useEffect(() => {
    const fetchNama = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("siswa_profiles")
        .select("nama_lengkap")
        .eq("id", user.id)
        .single();

      setNama(data?.nama_lengkap || "Siswa");
    };
    fetchNama();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 text-left w-full max-w-md mb-6">
      <h2 className="text-xl font-bold text-red-600 mb-2">
        Selamat Datang, {nama}!
      </h2>
      <p className="text-gray-700">
        Silakan isi absensi harian kamu di bawah ini.
      </p>
    </div>
  );
}
