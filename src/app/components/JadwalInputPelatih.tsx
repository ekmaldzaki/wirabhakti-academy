"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JadwalInputPelatih() {
  const [cabang, setCabang] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamBerakhir, setJamBerakhir] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const fetchPelatih = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: pelatih } = await supabase
        .from("pelatih_profiles")
        .select("cabang_olahraga")
        .eq("id", user.id)
        .single();

      if (pelatih?.cabang_olahraga) {
        setCabang(pelatih.cabang_olahraga);
      }
    };

    fetchPelatih();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data: siswaList } = await supabase
      .from("siswa_profiles")
      .select("id")
      .eq("cabang_olahraga", cabang);

    if (!siswaList) return;

    const jadwalEntries = siswaList.map((siswa: any) => ({
      siswa_id: siswa.id,
      nama_kegiatan: namaKegiatan,
      tanggal,
      jam_mulai: jamMulai,
      jam_berakhir: jamBerakhir,
      catatan,
    }));

    const { error } = await supabase
      .from("jadwal_entries")
      .insert(jadwalEntries);
    if (error) {
      alert("Gagal menambahkan jadwal: " + error.message);
    } else {
      alert("Jadwal berhasil ditambahkan");
      setNamaKegiatan("");
      setTanggal("");
      setJamMulai("");
      setJamBerakhir("");
      setCatatan("");
    }
  };

  return (
    <div className="space-y-6 max-w-xl text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded space-y-2"
      >
        <h3 className="font-bold text-lg text-red-600">
          Input Jadwal Kegiatan
        </h3>
        <input
          type="text"
          value={cabang}
          readOnly
          className="w-full p-2 bg-gray-100 border"
        />
        <input
          type="text"
          placeholder="Nama Kegiatan"
          value={namaKegiatan}
          onChange={(e) => setNamaKegiatan(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
          className="w-full border p-2"
        />
        <div className="flex space-x-2">
          <input
            type="time"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            required
            className="w-full border p-2"
          />
          <input
            type="time"
            value={jamBerakhir}
            onChange={(e) => setJamBerakhir(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <textarea
          placeholder="Catatan (opsional)"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          className="w-full border p-2"
        />
        <button className="bg-red-600 text-white px-4 py-2 w-full rounded">
          Tambahkan
        </button>
      </form>
    </div>
  );
}
