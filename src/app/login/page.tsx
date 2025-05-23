"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const role = roleData?.role;
    if (role === "siswa") router.push("/siswa");
    else if (role === "pelatih") router.push("/pelatih");
    else if (role === "admin") router.push("/admin");
    else setError("Role tidak ditemukan");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8 text-black">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-lg border border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
          Login
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
        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
        >
          Login
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
