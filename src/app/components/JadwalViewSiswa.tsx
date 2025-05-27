"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JadwalViewSiswa() {
  const [jadwal, setJadwal] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("jadwal_entries")
        .select("*")
        .eq("siswa_id", user.id)
        .order("tanggal", { ascending: true });

      setJadwal(data || []);
    };

    fetch();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow text-black space-y-2">
      <h3 className="font-bold text-lg mb-2 text-red-600">
        Jadwal Kegiatan Kamu
      </h3>
      {jadwal.length === 0 && <p>Tidak ada jadwal saat ini.</p>}
      {jadwal.map((entry) => (
        <div key={entry.id} className="border p-2 rounded">
          <p>
            <strong>{entry.nama_kegiatan}</strong>
          </p>
          <p>
            {entry.tanggal} | {entry.jam_mulai} - {entry.jam_berakhir}
          </p>
          {entry.catatan && (
            <p className="text-sm text-gray-600">Catatan: {entry.catatan}</p>
          )}
        </div>
      ))}
    </div>
  );
}
