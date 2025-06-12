"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AbsensiInputPelatih() {
  const [sessionId, setSessionId] = useState<string>("");
  const [cabangOlahraga, setCabangOlahraga] = useState<string>("");
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [catatans, setCatatans] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndSiswa = async () => {
      setLoading(true);

      // Ambil sesi terbaru
      const { data: sessions, error: sessionError } = await supabase
        .from("absensi_sessions")
        .select("id, cabang_olahraga")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (sessionError || !sessions) {
        console.error("Gagal ambil sesi:", sessionError?.message);
        setLoading(false);
        return;
      }

      const { id, cabang_olahraga } = sessions;
      setSessionId(id);
      setCabangOlahraga(cabang_olahraga);

      const { data: siswaData, error: siswaError } = await supabase
        .from("siswa_profiles")
        .select("id, nama_lengkap")
        .eq("cabang_olahraga", cabang_olahraga);

      setSiswaList(siswaData || []);
      setLoading(false);
    };

    fetchSessionAndSiswa();
  }, []);

  const handleSubmit = async () => {
    const now = new Date().toISOString();

    const updates = siswaList.map((siswa) => ({
      session_id: sessionId,
      siswa_id: siswa.id,
      status: statuses[siswa.id] || "tidak hadir",
      catatan: catatans[siswa.id] || null,
      submitted_at: now,
    }));

    const { error } = await supabase.from("absensi_entries").upsert(updates, {
      onConflict: "session_id,siswa_id",
    });

    if (error) alert("Gagal simpan absensi: " + error.message);
    else alert("Absensi berhasil disimpan!");
  };

  return (
    <div className="space-y-4 mt-4 text-black">
      <h3 className="text-lg font-bold">Input Kehadiran Siswa</h3>

      {loading ? (
        <p>Memuat data sesi & siswa...</p>
      ) : siswaList.length === 0 ? (
        <p className="text-gray-500">
          Tidak ada siswa ditemukan untuk cabang olahraga ini.
        </p>
      ) : (
        siswaList.map((siswa) => (
          <div
            key={siswa.id}
            className="border p-2 rounded shadow-sm bg-gray-50 flex flex-col"
          >
            <span className="font-medium">
              {siswa.nama_lengkap || "Nama tidak ditemukan"}
            </span>
            <select
              value={statuses[siswa.id] || "tidak hadir"}
              onChange={(e) =>
                setStatuses({ ...statuses, [siswa.id]: e.target.value })
              }
              className="border p-1 my-1"
            >
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="tidak hadir">Tidak Hadir</option>
            </select>
            {(statuses[siswa.id] === "izin" ||
              statuses[siswa.id] === "sakit") && (
              <textarea
                value={catatans[siswa.id] || ""}
                onChange={(e) =>
                  setCatatans({ ...catatans, [siswa.id]: e.target.value })
                }
                className="border p-1 text-sm"
                placeholder="Alasan izin/sakit"
              />
            )}
          </div>
        ))
      )}

      <button
        onClick={handleSubmit}
        className="bg-red-600 text-white px-4 py-2 rounded w-full"
      >
        Simpan Absensi
      </button>
    </div>
  );
}
