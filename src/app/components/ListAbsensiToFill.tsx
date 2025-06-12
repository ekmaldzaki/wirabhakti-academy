"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ListAbsensiToFill() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("absensi_entries")
        .select(
          "status, catatan, submitted_at, absensi_sessions(tanggal, waktu_mulai, waktu_selesai, keterangan)"
        )
        .eq("siswa_id", user.id)
        .order("submitted_at", { ascending: false });

      setEntries(data || []);
    };

    fetch();
  }, []);

  return (
    <div className="space-y-4 mt-4 text-black">
      <h2 className="font-bold text-lg">Riwayat Kehadiran</h2>
      {entries.length === 0 ? (
        <p>Belum ada data kehadiran.</p>
      ) : (
        entries.map((entry, i) => (
          <div key={i} className="border p-3 rounded bg-gray-50">
            <p>
              <strong>Tanggal:</strong> {entry.absensi_sessions?.tanggal}
            </p>
            <p>
              <strong>Jam:</strong> {entry.absensi_sessions?.waktu_mulai} -{" "}
              {entry.absensi_sessions?.waktu_selesai}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  entry.status === "hadir"
                    ? "text-green-600"
                    : "text-red-600 font-semibold"
                }
              >
                {entry.status}
              </span>
            </p>
            {entry.catatan && (
              <p>
                <strong>Catatan:</strong> {entry.catatan}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
