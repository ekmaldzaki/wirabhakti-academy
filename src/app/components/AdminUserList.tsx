"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserEntry {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminUserList() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

      if (error) {
        console.error("Gagal memuat data user:", error);
        setUsers([]);
      } else {
        const processed = data.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        }));
        setUsers(processed);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow text-black max-w-5xl mx-auto mt-4">
      <h3 className="text-lg font-bold mb-4 text-red-600">
        Daftar Akun Pengguna
      </h3>
      {loading ? (
        <p>Memuat data pengguna...</p>
      ) : users.length === 0 ? (
        <p>Tidak ada akun ditemukan.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Dibuat Pada</th>
              <th className="border p-2 text-left">Login Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {new Date(user.created_at).toLocaleString()}
                </td>
                <td className="border p-2">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "Belum Pernah Login"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
