"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AbsensiInputPelatih() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cabangOlahraga, setCabangOlahraga] = useState<string>("");
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [catatans, setCatatans] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    id: string;
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
  } | null>(null);

  useEffect(() => {
    const fetchSessionAndSiswa = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: pelatih, error: pelatihError } = await supabase
        .from("pelatih_profiles")
        .select("cabang_olahraga")
        .eq("id", user.id)
        .single();

      if (pelatihError || !pelatih) {
        console.error("Gagal ambil data pelatih:", pelatihError?.message);
        setLoading(false);
        return;
      }

      const cabang = pelatih.cabang_olahraga;
      setCabangOlahraga(cabang);

      const { data: sessionData, error: sessionError } = await supabase
        .from("absensi_sessions")
        .select("id, tanggal, waktu_mulai, waktu_selesai")
        .eq("cabang_olahraga", cabang)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (sessionError || !sessionData) {
        console.log("Tidak ada sesi tersedia.");
        setSessionInfo(null);
        setSessionId(null);
        setLoading(false);
        return;
      }

      const sessionEnd = new Date(
        `${sessionData.tanggal}T${sessionData.waktu_selesai}`
      );
      const now = new Date();

      if (now > sessionEnd) {
        setSessionExpired(true);
        setSessionInfo(null);
        setSessionId(null);
        setLoading(false);
        return;
      }

      setSessionId(sessionData.id);
      setSessionInfo({
        id: sessionData.id,
        tanggal: sessionData.tanggal,
        waktu_mulai: sessionData.waktu_mulai,
        waktu_selesai: sessionData.waktu_selesai,
      });

      const { data: siswaData, error: siswaError } = await supabase
        .from("siswa_profiles")
        .select("id, nama_lengkap")
        .eq("cabang_olahraga", cabang);

      if (siswaError) {
        console.error("Gagal ambil siswa:", siswaError.message);
        setLoading(false);
        return;
      }

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

  const handleDeleteSession = async () => {
    if (!sessionInfo?.id) return;
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus sesi ini?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("absensi_sessions")
      .delete()
      .eq("id", sessionInfo.id);

    if (error) {
      alert("Gagal menghapus sesi: " + error.message);
    } else {
      alert("Sesi berhasil dihapus.");
      setSessionId(null);
      setSessionInfo(null);
      setSiswaList([]);
    }
  };

  return (
    <div className="space-y-4 mt-4 text-black">
      <h3 className="text-lg font-bold">
        Input Kehadiran Siswa ({cabangOlahraga})
      </h3>

      {loading ? (
        <p>Memuat data sesi & siswa...</p>
      ) : !sessionInfo ? (
        <p className="text-gray-500">
          Belum ada sesi yang dibuat, silakan buat sesi terlebih dahulu.
        </p>
      ) : (
        <>
          <div className="text-sm text-gray-600 flex justify-between items-center">
            <div>
              Sesi Tanggal: <strong>{sessionInfo.tanggal}</strong>, Jam:{" "}
              <strong>
                {sessionInfo.waktu_mulai} - {sessionInfo.waktu_selesai}
              </strong>
            </div>
            <button
              onClick={handleDeleteSession}
              className="text-sm text-red-600 underline ml-2"
            >
              Hapus Sesi
            </button>
          </div>

          {siswaList.length === 0 ? (
            <p className="text-gray-500">
              Tidak ada siswa ditemukan untuk cabang olahraga ini.
            </p>
          ) : (
            <>
              {siswaList.map((siswa) => (
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
                        setCatatans({
                          ...catatans,
                          [siswa.id]: e.target.value,
                        })
                      }
                      className="border p-1 text-sm"
                      placeholder="Alasan izin/sakit"
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="bg-red-600 text-white px-4 py-2 rounded w-full"
              >
                Simpan Absensi
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
