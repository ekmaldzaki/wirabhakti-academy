"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SppInputAdmin() {
  const [cabangs, setCabangs] = useState<string[]>([]);
  const [cabang, setCabang] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [nominal, setNominal] = useState(0);
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const fetchCabangs = async () => {
      const { data, error } = await supabase
        .from("siswa_profiles")
        .select("cabang_olahraga");

      if (data) {
        const uniqueCabangs = Array.from(
          new Set(data.map((item) => item.cabang_olahraga).filter(Boolean))
        );
        setCabangs(uniqueCabangs);
      }
    };

    fetchCabangs();
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
      setCabang("");
      setBulan("");
      setTahun(new Date().getFullYear());
      setNominal(0);
      setCatatan("");
    }
  };

  return (
    <div className="space-y-6 max-w-full text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded space-y-2"
      >
        <h3 className="font-bold text-lg text-red-600">Input SPP Bulanan</h3>
        <select
          value={cabang}
          onChange={(e) => setCabang(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="">Pilih Cabang Olahraga</option>
          {cabangs.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
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
