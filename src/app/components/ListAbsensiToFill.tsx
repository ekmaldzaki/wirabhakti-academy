"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DateTime } from "luxon";

export default function ListAbsensiToFill() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [siswaId, setSiswaId] = useState("");
  const [cabang, setCabang] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setSiswaId(user.id);

      const { data: profile } = await supabase
        .from("siswa_profiles")
        .select("cabang_olahraga")
        .eq("id", user.id)
        .single();

      if (!profile?.cabang_olahraga) {
        setCabang("-");
        setSessions([]);
        return;
      }

      const now = DateTime.now().setZone("Asia/Jakarta");

      const { data: sesi } = await supabase
        .from("absensi_sessions")
        .select("*, pelatih_profiles(nama_lengkap)")
        .ilike("cabang_olahraga", profile.cabang_olahraga)
        .order("tanggal", { ascending: false });

      const filtered = (sesi || []).filter((s) => {
        const endTime = DateTime.fromISO(`${s.tanggal}T${s.waktu_selesai}`, {
          zone: "Asia/Jakarta",
        });
        return endTime > now;
      });

      setCabang(profile.cabang_olahraga);
      setSessions(filtered);
    };

    fetch();
  }, []);

  return (
    <div className="space-y-4 mt-4">
      <h2 className="font-bold text-lg mb-2 text-black">
        Absensi untuk {cabang}
      </h2>
      {sessions.map((session) => (
        <FormIsiAbsensi key={session.id} session={session} siswaId={siswaId} />
      ))}
    </div>
  );
}

function FormIsiAbsensi({ session, siswaId }: any) {
  const [status, setStatus] = useState("hadir");
  const [catatan, setCatatan] = useState("");
  const [sudahAbsen, setSudahAbsen] = useState(false);

  useEffect(() => {
    const fetchAbsensi = async () => {
      const { data: entry } = await supabase
        .from("absensi_entries")
        .select("id, status")
        .eq("session_id", session.id)
        .eq("siswa_id", siswaId)
        .single();

      if (entry) {
        if (entry.status !== "tidak hadir") {
          setSudahAbsen(true); // Sudah isi absensi
        }
      }
    };

    fetchAbsensi();
  }, [session.id, siswaId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validasi catatan wajib saat izin/sakit
    if ((status === "izin" || status === "sakit") && catatan.trim() === "") {
      alert("Harap isi catatan untuk izin atau sakit.");
      return;
    }

    const { error } = await supabase
      .from("absensi_entries")
      .update({ status, catatan })
      .eq("session_id", session.id)
      .eq("siswa_id", siswaId);

    if (error) alert("Gagal isi absensi: " + error.message);
    else {
      alert("Berhasil mengisi absensi");
      setSudahAbsen(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded shadow bg-gray-50 text-black"
    >
      <p className="font-semibold mb-1">Tanggal: {session.tanggal}</p>
      <p className="mb-1 text-sm">
        Jam: {session.waktu_mulai} - {session.waktu_selesai}
      </p>
      <p className="mb-2 text-sm">
        Oleh: {session.pelatih_profiles?.nama_lengkap}
      </p>

      {sudahAbsen ? (
        <p className="text-green-600 font-semibold">✅ Sudah absen</p>
      ) : (
        <>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="hadir">Hadir</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
          </select>

          {(status === "izin" || status === "sakit") && (
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="border p-2 mb-2 w-full"
              placeholder="Tuliskan alasan izin/sakit..."
              required
            />
          )}

          <button className="bg-red-600 text-white px-4 py-1 rounded w-full">
            Kirim
          </button>
        </>
      )}
    </form>
  );
}
