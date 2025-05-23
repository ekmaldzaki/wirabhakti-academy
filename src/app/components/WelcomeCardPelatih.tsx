"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WelcomeCardPelatih() {
  const [nama, setNama] = useState("");

  useEffect(() => {
    const fetchNama = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("pelatih_profiles")
        .select("nama_lengkap")
        .eq("id", user.id)
        .single();

      setNama(data?.nama_lengkap || "Pelatih");
    };
    fetchNama();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 text-left w-full max-w-md mb-6">
      <h2 className="text-xl font-bold text-red-600 mb-2">Halo, {nama}!</h2>
      <p className="text-gray-700">Berikut adalah daftar absensi siswa.</p>
    </div>
  );
}
