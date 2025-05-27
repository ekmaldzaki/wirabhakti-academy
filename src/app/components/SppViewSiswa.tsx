"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SppSiswaView() {
  const [spp, setSpp] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("spp_entries")
        .select("*")
        .eq("siswa_id", user.id)
        .order("tahun", { ascending: false })
        .order("bulan", { ascending: false });

      setSpp(data || []);
    };

    fetch();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow text-black space-y-2">
      <h3 className="font-bold text-lg mb-2 text-red-600">Tagihan SPP Kamu</h3>
      {spp.length === 0 && <p>Tidak ada tagihan SPP saat ini.</p>}
      {spp.map((entry) => (
        <div key={entry.id} className="border p-2 rounded">
          <p>
            Bulan: <strong>{entry.bulan}</strong> {entry.tahun}
          </p>
          <p>Nominal: Rp{entry.nominal.toLocaleString()}</p>
          {entry.catatan && (
            <p className="text-sm text-gray-600">Catatan: {entry.catatan}</p>
          )}
        </div>
      ))}
    </div>
  );
}
