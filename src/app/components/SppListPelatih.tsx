"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SppListPelatih() {
  const [cabang, setCabang] = useState("");
  const [sppList, setSppList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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
        await fetchSpp(pelatih.cabang_olahraga);
      }
    };

    fetchData();
  }, []);

  const fetchSpp = async (cabang: string) => {
    // Ambil daftar siswa sesuai cabang
    const { data: siswaList, error: siswaError } = await supabase
      .from("siswa_profiles")
      .select("id, nama_lengkap")
      .ilike("cabang_olahraga", cabang);

    if (!siswaList || siswaList.length === 0) {
      console.warn("Tidak ada siswa ditemukan untuk cabang:", cabang);
      setSppList([]);
      return;
    }

    const siswaMap = new Map(siswaList.map((s: any) => [s.id, s.nama_lengkap]));
    const ids = siswaList.map((s) => s.id);

    // Ambil semua data SPP siswa di cabang ini
    const { data: sppData, error: sppError } = await supabase
      .from("spp_entries")
      .select("*")
      .in("siswa_id", ids)
      .order("tahun", { ascending: false })
      .order("bulan", { ascending: false });

    if (sppError) {
      console.error("SPP Error:", sppError);
      return;
    }

    // const bulanRaw = new Date().toLocaleString("id-ID", { month: "long" });
    // const bulanFix = bulanRaw.charAt(0).toUpperCase() + bulanRaw.slice(1).toLowerCase();
    // const tahunFix = new Date().getFullYear();
    // const sppFiltered = sppData?.filter(e => e.bulan === bulanFix && e.tahun === tahunFix);

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
    if (error) {
      alert("Gagal menghapus data.");
    } else {
      setSppList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  return (
    <div className="bg-white p-4 shadow rounded max-w-full mx-auto mt-4 text-black">
      <h3 className="text-lg font-bold mb-4 text-red-600">
        Daftar SPP Bulan Ini
      </h3>
      {sppList.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada data SPP bulan ini.</p>
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
