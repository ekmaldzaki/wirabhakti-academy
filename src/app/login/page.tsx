"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setMessage("");

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

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // Halaman tujuan setelah klik link di email
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Email reset password telah dikirim.");
      setIsResetting(false);
    }
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
        {!isResetting && (
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        {message && <p className="text-green-600 mb-3 text-sm">{message}</p>}

        {isResetting ? (
          <button
            onClick={handleResetPassword}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md transition"
          >
            Kirim Link Reset
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
          >
            Login
          </button>
        )}

        <div className="mt-4 text-sm text-center">
          {!isResetting ? (
            <button
              onClick={() => setIsResetting(true)}
              className="text-blue-600 hover:underline"
            >
              Lupa Password?
            </button>
          ) : (
            <button
              onClick={() => setIsResetting(false)}
              className="text-gray-600 hover:underline"
            >
              ← Kembali ke Login
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-4 text-sm text-gray-600 hover:text-red-600 transition"
      >
        ← Kembali ke Beranda
      </button>
    </div>
  );
}
