"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SppInputPelatih() {
  const [cabang, setCabang] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [nominal, setNominal] = useState(0);
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

    const sppEntries = siswaList.map((siswa: any) => ({
      siswa_id: siswa.id,
      bulan,
      tahun,
      nominal,
      catatan,
    }));

    const { error } = await supabase.from("spp_entries").insert(sppEntries);
    if (error) {
      alert("Gagal menambahkan SPP: " + error.message);
    } else {
      alert("SPP berhasil ditambahkan");
      // Clear form
      setBulan("");
      setTahun(new Date().getFullYear());
      setNominal(0);
      setCatatan("");
    }
  };

  return (
    <div className="space-y-6 max-w-xl text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded space-y-2"
      >
        <h3 className="font-bold text-lg text-red-600">Input SPP Bulanan</h3>
        <input
          type="text"
          value={cabang}
          readOnly
          className="w-full p-2 bg-gray-100 border"
        />
        <input
          type="text"
          placeholder="Bulan (misal: Mei)"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          placeholder="Tahun"
          value={tahun}
          onChange={(e) => setTahun(parseInt(e.target.value))}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          placeholder="Nominal"
          value={nominal}
          onChange={(e) => setNominal(parseInt(e.target.value))}
          className="w-full border p-2"
          required
        />
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
