"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AbsensiSessionForm() {
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [cabangOlahraga, setCabangOlahraga] = useState("");
  const [namaPelatih, setNamaPelatih] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    const fetchPelatih = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("pelatih_profiles")
        .select("nama_lengkap, cabang_olahraga")
        .eq("id", user.id)
        .single();

      if (data) {
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

    const { data: sessionData, error } = await supabase
      .from("absensi_sessions")
      .insert({
        tanggal,
        waktu_mulai: jamMulai,
        waktu_selesai: jamSelesai,
        pelatih_id: user.id,
        cabang_olahraga: cabangOlahraga,
        keterangan,
      });

    if (error) alert("Gagal membuat sesi: " + error.message);
    else alert("Sesi absensi berhasil dibuat!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow text-black"
    >
      <h3 className="font-bold text-lg text-red-600">Buat Jadwal Absensi</h3>
      <p className="text-sm text-gray-500">Oleh: {namaPelatih}</p>

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
      <textarea
        value={keterangan}
        onChange={(e) => setKeterangan(e.target.value)}
        className="w-full border p-2"
        placeholder="Keterangan sesi (opsional)"
      />
      <button className="bg-red-600 text-white px-4 py-2 rounded w-full">
        Buat Sesi
      </button>
    </form>
  );
}
