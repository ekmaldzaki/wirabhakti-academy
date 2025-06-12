"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    tempat_tanggal_lahir: "",
    cabang_olahraga: "",
    posisi: "",
    nomor_hp: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!roleData) return;

      setRole(roleData.role);

      const profileTable =
        roleData.role === "siswa" ? "siswa_profiles" : "pelatih_profiles";

      const { data: profile } = await supabase
        .from(profileTable)
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData(profile);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const profileTable =
      role === "siswa" ? "siswa_profiles" : "pelatih_profiles";

    const { data: existing } = await supabase
      .from(profileTable)
      .select("id")
      .eq("id", userId)
      .single();

    let payload: any = {
      id: userId,
      nama_lengkap: formData.nama_lengkap,
      cabang_olahraga: formData.cabang_olahraga,
    };

    if (role === "siswa") {
      payload.tempat_tanggal_lahir = formData.tempat_tanggal_lahir;
      payload.posisi = formData.posisi;
      payload.nomor_hp = formData.nomor_hp;
    }

    let result;
    if (existing) {
      result = await supabase
        .from(profileTable)
        .update(payload)
        .eq("id", userId);
    } else {
      result = await supabase.from(profileTable).insert(payload);
    }

    if (result.error) {
      alert("Gagal menyimpan data: " + result.error.message);
    } else {
      alert("Biodata berhasil disimpan!");
      router.push(`/`);
    }
  };

  const handleBack = () => {
    if (role === "siswa") {
      router.push("/siswa");
    } else if (role === "pelatih") {
      router.push("/pelatih");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8 text-black">
      <div className="w-full max-w-xl p-6 rounded-xl shadow-lg border border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-center text-red-700 mb-6">
          Pengaturan Profil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {role === "siswa" && (
            <>
              <div>
                <label className="block font-medium mb-1">
                  Tempat, Tanggal Lahir
                </label>
                <input
                  type="text"
                  name="tempat_tanggal_lahir"
                  value={formData.tempat_tanggal_lahir}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Cabang Olahraga
                </label>
                <select
                  name="cabang_olahraga"
                  value={formData.cabang_olahraga}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">-- Pilih Cabang Olahraga --</option>
                  <option value="Basket">Basket</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Sepak Bola">Sepak Bola</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Posisi</label>
                <input
                  type="text"
                  name="posisi"
                  value={formData.posisi}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Nomor HP</label>
                <input
                  type="tel"
                  name="nomor_hp"
                  value={formData.nomor_hp}
                  onChange={handleChange}
                  pattern="08[0-9]{8,11}"
                  placeholder="08xxxxxxxxxx"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </>
          )}

          {role === "pelatih" && (
            <div>
              <label className="block font-medium mb-1">Cabang Olahraga</label>
              <select
                name="cabang_olahraga"
                value={formData.cabang_olahraga}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">-- Pilih Cabang Olahraga --</option>
                <option value="Basket">Basket</option>
                <option value="Futsal">Futsal</option>
                <option value="Sepak Bola">Sepak Bola</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
            >
              Simpan Biodata
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded-md transition"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
