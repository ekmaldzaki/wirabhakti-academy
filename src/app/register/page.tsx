"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"siswa" | "pelatih">("siswa");
  const [kodePelatih, setKodePelatih] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setError("");

    if (role === "pelatih" && kodePelatih !== "SUSUMUSEMANGATKU") {
      setError("Kunci pelatih salah");
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setError(signupError.message);
      return;
    }

    const user = data.user;
    if (!user) {
      setError("Gagal membuat akun.");
      return;
    }

    const uid = user.id;

    const { error: roleError } = await supabase.from("user_roles").insert({
      id: uid,
      role,
    });

    if (roleError) {
      setError("Gagal menyimpan role: " + roleError.message);
      return;
    }

    const profileTable =
      role === "siswa" ? "siswa_profiles" : "pelatih_profiles";
    const { error: profileError } = await supabase.from(profileTable).insert({
      id: uid,
    });

    if (profileError) {
      setError("Gagal menyimpan profil: " + profileError.message);
      return;
    }

    alert("Silakan cek email untuk verifikasi");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8 text-black">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-lg border border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
          Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="siswa">Siswa</option>
          <option value="pelatih">Pelatih</option>
        </select>
        {role === "pelatih" && (
          <input
            type="text"
            placeholder="Kunci Pelatih"
            className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={kodePelatih}
            onChange={(e) => setKodePelatih(e.target.value)}
          />
        )}
        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        <button
          onClick={handleRegister}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
        >
          Register
        </button>
      </div>

      {/* Tombol kembali */}
      <button
        onClick={() => router.push("/")}
        className="mt-4 text-sm text-gray-600 hover:text-red-600 transition"
      >
        ← Kembali ke Beranda
      </button>
    </div>
  );
}
