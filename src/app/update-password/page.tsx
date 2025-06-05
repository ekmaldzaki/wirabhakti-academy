"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpdatePassword = async () => {
    setError("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password berhasil diubah. Silakan login kembali.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
      <div className="max-w-md w-full space-y-6 bg-white p-6 border shadow rounded">
        <h2 className="text-2xl font-bold text-center text-red-600">
          Ubah Password
        </h2>
        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        <button
          onClick={handleUpdatePassword}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold"
        >
          Simpan Password Baru
        </button>
      </div>
    </div>
  );
}
