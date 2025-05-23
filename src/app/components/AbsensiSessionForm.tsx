"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AbsensiSessionForm() {
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [cabangOlahraga, setCabangOlahraga] = useState("");
  const [namaPelatih, setNamaPelatih] = useState("");

  useEffect(() => {
    const fetchPelatih = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("pelatih_profiles")
        .select("nama_lengkap, cabang_olahraga")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setNamaPelatih(data.nama_lengkap);
        setCabangOlahraga(data.cabang_olahraga);
      }
    };
    fetchPelatih();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("absensi_sessions").insert({
      tanggal,
      waktu_mulai: jamMulai,
      waktu_selesai: jamSelesai,
      pelatih_id: user.id,
      cabang_olahraga: cabangOlahraga,
    });

    if (error) alert("Gagal membuat sesi: " + error.message);
    else alert("Sesi absensi berhasil dibuat!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 bg-white p-4 rounded shadow max-w-md w-full text-black"
    >
      <h3 className="font-bold text-lg text-red-600">Buat Jadwal Absensi</h3>
      <p className="text-sm text-gray-500 mb-2">Oleh: {namaPelatih}</p>
      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="time"
        value={jamMulai}
        onChange={(e) => setJamMulai(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="time"
        value={jamSelesai}
        onChange={(e) => setJamSelesai(e.target.value)}
        className="w-full border p-2"
        required
      />
      <button className="bg-red-600 text-white px-4 py-2 rounded w-full">
        Buat Sesi
      </button>
    </form>
  );
}
