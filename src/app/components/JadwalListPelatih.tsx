"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JadwalListPelatih() {
  const [jadwalList, setJadwalList] = useState<any[]>([]);

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

      if (!pelatih) return;

      const { data: siswaList } = await supabase
        .from("siswa_profiles")
        .select("id, nama_lengkap")
        .eq("cabang_olahraga", pelatih.cabang_olahraga);

      if (!siswaList) return;

      const siswaMap = new Map(siswaList.map((s) => [s.id, s.nama_lengkap]));
      const ids = siswaList.map((s) => s.id);

      const { data: jadwalData } = await supabase
        .from("jadwal_entries")
        .select("*")
        .in("siswa_id", ids)
        .order("tanggal", { ascending: false });

      const dataGabung = jadwalData?.map((entry) => ({
        ...entry,
        nama: siswaMap.get(entry.siswa_id),
      }));

      setJadwalList(dataGabung || []);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Hapus jadwal ini?");
    if (!confirm) return;

    const { error } = await supabase
      .from("jadwal_entries")
      .delete()
      .eq("id", id);
    if (!error) {
      setJadwalList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded max-w-full mx-auto mt-4 text-black">
      <h3 className="text-lg font-bold mb-4 text-red-600">
        Daftar Jadwal Kegiatan
      </h3>
      {jadwalList.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada jadwal kegiatan.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nama</th>
                <th className="border p-2 text-left">Kegiatan</th>
                <th className="border p-2 text-left">Tanggal</th>
                <th className="border p-2 text-left">Waktu</th>
                <th className="border p-2 text-left">Catatan</th>
                <th className="border p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jadwalList.map((entry) => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.nama || "Tanpa Nama"}</td>
                  <td className="border p-2">{entry.nama_kegiatan}</td>
                  <td className="border p-2">{entry.tanggal}</td>
                  <td className="border p-2">
                    {entry.jam_mulai} - {entry.jam_berakhir}
                  </td>
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
