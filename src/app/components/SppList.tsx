"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SppListAdmin() {
  const [cabangs, setCabangs] = useState<string[]>([]);
  const [cabang, setCabang] = useState("");
  const [sppList, setSppList] = useState<any[]>([]);

  useEffect(() => {
    const fetchCabangs = async () => {
      const { data } = await supabase
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

  useEffect(() => {
    if (cabang) {
      fetchSpp(cabang);
    }
  }, [cabang]);

  const fetchSpp = async (selectedCabang: string) => {
    const { data: siswaList } = await supabase
      .from("siswa_profiles")
      .select("id, nama_lengkap")
      .eq("cabang_olahraga", selectedCabang);

    if (!siswaList || siswaList.length === 0) {
      setSppList([]);
      return;
    }

    const siswaMap = new Map(siswaList.map((s) => [s.id, s.nama_lengkap]));
    const ids = siswaList.map((s) => s.id);

    const { data: sppData } = await supabase
      .from("spp_entries")
      .select("*")
      .in("siswa_id", ids)
      .order("tahun", { ascending: false })
      .order("bulan", { ascending: false });

    const dataGabung = sppData?.map((entry) => ({
      ...entry,
      nama: siswaMap.get(entry.siswa_id),
    }));

    setSppList(dataGabung || []);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Yakin ingin menghapus entri ini?");
    if (!confirm) return;

    const { error } = await supabase.from("spp_entries").delete().eq("id", id);
    if (!error) {
      setSppList((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Gagal menghapus data.");
    }
  };

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  return (
    <div className="bg-white p-4 shadow rounded max-w-full mx-auto mt-4 text-black">
      <h3 className="text-lg font-bold mb-4 text-red-600">Daftar SPP Siswa</h3>
      <select
        value={cabang}
        onChange={(e) => setCabang(e.target.value)}
        className="mb-4 border p-2 w-full"
      >
        <option value="">Pilih Cabang Olahraga</option>
        {cabangs.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {sppList.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada data SPP untuk cabang ini.
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nama</th>
                <th className="border p-2 text-left">Bulan</th>
                <th className="border p-2 text-left">Nominal</th>
                <th className="border p-2 text-left">Catatan</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sppList.map((entry) => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.nama || "Tanpa Nama"}</td>
                  <td className="border p-2">
                    {entry.bulan} {entry.tahun}
                  </td>
                  <td className="border p-2">{formatRupiah(entry.nominal)}</td>
                  <td className="border p-2">{entry.catatan || "-"}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
