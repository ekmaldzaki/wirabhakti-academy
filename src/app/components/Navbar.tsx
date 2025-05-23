"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", user.id)
          .single();

        setRole(roleData?.role || "");

        let profileTable = "";
        if (roleData?.role === "siswa") profileTable = "siswa_profiles";
        if (roleData?.role === "pelatih") profileTable = "pelatih_profiles";

        if (profileTable) {
          const { data: profile } = await supabase
            .from(profileTable)
            .select("nama_lengkap")
            .eq("id", user.id)
            .single();
          setNamaLengkap(profile?.nama_lengkap || "");
        }
      } else {
        setNamaLengkap("");
        setRole("");
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        getUser();
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const handleDashboard = () => {
    if (role === "siswa") {
      router.push("/siswa");
    } else if (role === "pelatih") {
      router.push("/pelatih");
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-red-700 text-white p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-lg font-bold">
          Wirabhakti Academy
        </Link>

        {/* Burger menu button (mobile) */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <>
              <button
                onClick={handleDashboard}
                className="px-3 py-1 rounded bg-white text-red-700 font-semibold hover:bg-gray-200"
              >
                {namaLengkap || "Dashboard"}
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="px-3 py-1 rounded border border-white text-white font-semibold hover:bg-white hover:text-red-700"
              >
                Pengaturan Akun
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-white text-red-700 font-semibold hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-3 py-1 rounded bg-white text-red-700 font-semibold hover:bg-gray-200"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col md:hidden gap-2 mt-4 px-4">
          {user ? (
            <>
              <button
                onClick={handleDashboard}
                className="w-full text-left px-4 py-2 rounded bg-white text-red-700 font-semibold"
              >
                {namaLengkap || "Dashboard"}
              </button>
              <button
                onClick={() => {
                  router.push("/settings");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded border border-white text-white font-semibold"
              >
                Pengaturan Akun
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded bg-white text-red-700 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded bg-white text-red-700 font-semibold"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
