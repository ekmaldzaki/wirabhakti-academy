"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AbsensiEntry {
  id: string;
  status: string;
  catatan: string | null;
  siswa_profiles: {
    nama_lengkap: string;
  } | null;
  absensi_sessions: {
    pelatih_id: string;
    cabang_olahraga: string;
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
  } | null;
}

export default function AbsensiSessionListPelatih() {
  const [absensi, setAbsensi] = useState<AbsensiEntry[]>([]);
  const [filtered, setFiltered] = useState<AbsensiEntry[]>([]);
  const [cabangList, setCabangList] = useState<string[]>([]);
  const [statusList, setStatusList] = useState<string[]>([]);

  const [filterCabang, setFilterCabang] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [sortNama, setSortNama] = useState("asc");

  useEffect(() => {
    const fetchAbsensi = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: absensiData, error } = await supabase
        .from("absensi_entries")
        .select(
          `
    id,
    status,
    catatan,
    siswa_profiles!fk_siswa_id(nama_lengkap),
    absensi_sessions!fk_session_id(pelatih_id, cabang_olahraga, tanggal, waktu_mulai, waktu_selesai)
    `
        )
        .eq("absensi_sessions.pelatih_id", user.id);

      if (error) {
        console.error("Gagal fetch absensi:", error.message, error.details);
      } else {
        console.log("Data absensi:", absensiData);
      }

      if (error) {
        console.error("Gagal fetch absensi:", error.message, error.details);
        return;
      }

      // Pastikan relasi bukan array (kalau perlu handle manual)
      const cleanData = (absensiData || []).map((entry: any) => ({
        ...entry,
        siswa_profiles: Array.isArray(entry.siswa_profiles)
          ? entry.siswa_profiles[0]
          : entry.siswa_profiles,
        absensi_sessions: Array.isArray(entry.absensi_sessions)
          ? entry.absensi_sessions[0]
          : entry.absensi_sessions,
      }));

      const onlyMyData = cleanData.filter(
        (entry) => entry.absensi_sessions?.pelatih_id === user.id
      );

      setAbsensi(onlyMyData);

      const allCabang = Array.from(
        new Set(
          onlyMyData
            .map((e) => e.absensi_sessions?.cabang_olahraga)
            .filter(Boolean)
        )
      );
      setCabangList(allCabang);

      const allStatus = Array.from(
        new Set(onlyMyData.map((e) => e.status).filter(Boolean))
      );
      setStatusList(allStatus);
    };

    fetchAbsensi();
  }, []);

  useEffect(() => {
    const filteredData = absensi
      .filter((entry) =>
        filterCabang === "semua"
          ? true
          : entry.absensi_sessions?.cabang_olahraga === filterCabang
      )
      .filter((entry) =>
        filterStatus === "semua" ? true : entry.status === filterStatus
      )
      .sort((a, b) => {
        const nameA = a.siswa_profiles?.nama_lengkap || "";
        const nameB = b.siswa_profiles?.nama_lengkap || "";
        return sortNama === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

    setFiltered(filteredData);
  }, [absensi, filterCabang, filterStatus, sortNama]);

  return (
    <div className="space-y-4 mt-4 text-black">
      <h2 className="text-xl font-bold">Daftar Absensi Siswa</h2>

      {/* Filter controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <select
          className="border px-2 py-1"
          value={filterCabang}
          onChange={(e) => setFilterCabang(e.target.value)}
        >
          <option value="semua">Semua Cabang</option>
          {cabangList.map((cabang) => (
            <option key={cabang} value={cabang}>
              {cabang}
            </option>
          ))}
        </select>

        <select
          className="border px-2 py-1"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="semua">Semua Status</option>
          {statusList.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="border px-2 py-1"
          value={sortNama}
          onChange={(e) => setSortNama(e.target.value)}
        >
          <option value="asc">Urut Nama A-Z</option>
          <option value="desc">Urut Nama Z-A</option>
        </select>
      </div>

      {/* Tabel absensi */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">Nama</th>
              <th className="border p-1">Status</th>
              <th className="border p-1">Catatan</th>
              <th className="border p-1">Cabang</th>
              <th className="border p-1">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id}>
                <td className="border p-1">
                  {entry.siswa_profiles?.nama_lengkap || "Tidak Diketahui"}
                </td>
                <td className="border p-1">{entry.status}</td>
                <td className="border p-1">{entry.catatan || "-"}</td>
                <td className="border p-1">
                  {entry.absensi_sessions?.cabang_olahraga || "-"}
                </td>
                <td className="border p-1">
                  {entry.absensi_sessions?.tanggal || "-"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-2 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
