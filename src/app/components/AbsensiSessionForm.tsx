"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DateTime } from "luxon";

export default function AbsensiSessionForm() {
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [cabangOlahraga, setCabangOlahraga] = useState("");
  const [namaPelatih, setNamaPelatih] = useState("");
  const [sesiBerlangsung, setSesiBerlangsung] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchSessions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !cabangOlahraga) return;

      const { data: sessions } = await supabase
        .from("absensi_sessions")
        .select("*")
        .eq("pelatih_id", user.id)
        .eq("cabang_olahraga", cabangOlahraga);

      const now = DateTime.now().setZone("Asia/Jakarta");

      const filtered = (sessions || []).filter((s) => {
        const start = DateTime.fromISO(`${s.tanggal}T${s.waktu_mulai}`, {
          zone: "Asia/Jakarta",
        });
        const end = DateTime.fromISO(`${s.tanggal}T${s.waktu_selesai}`, {
          zone: "Asia/Jakarta",
        });
        return now >= start && now <= end;
      });

      setSesiBerlangsung(filtered);
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 60000); // Update setiap menit
    return () => clearInterval(interval);
  }, [cabangOlahraga]);

  const handleDelete = async (id: string) => {
    await supabase.from("absensi_sessions").delete().eq("id", id);
    setSesiBerlangsung((prev) => prev.filter((s) => s.id !== id));
  };

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
    <div className="space-y-6">
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

      <div className="bg-white p-4 rounded shadow max-w-md w-full text-black">
        <h3 className="font-bold mb-2">Sesi Sedang Berlangsung</h3>
        {sesiBerlangsung.length === 0 && (
          <p className="text-sm text-gray-500">
            Tidak ada sesi berlangsung saat ini.
          </p>
        )}
        {sesiBerlangsung.map((s) => (
          <div key={s.id} className="border p-2 mb-2 rounded">
            <p>
              {s.tanggal} | {s.waktu_mulai} - {s.waktu_selesai}
            </p>
            <button
              onClick={() => handleDelete(s.id)}
              className="text-sm bg-red-500 text-white px-2 py-1 rounded mt-1"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
