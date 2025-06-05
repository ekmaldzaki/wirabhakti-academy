"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation"; // Tambahan penting
import Navbar from "@/components/Navbar";
import EventAndSponsorGallery from "@/components/EventAndSponsorGallery";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  // 🆕 Penanganan setelah verifikasi email Supabase
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const type = searchParams.get("type");

    if (accessToken && type === "signup") {
      // Tunggu sebentar lalu arahkan ke login (atau dashboard jika mau)
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-full mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Selamat datang di Wirabhakti Academy
          </h1>

          {!loading && !isLoggedIn && (
            <>
              <p className="text-gray-600 mb-8">
                Silakan login atau registrasi untuk melanjutkan
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/login"
                  className="bg-red-600 text-white px-6 py-2 rounded"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="border border-red-600 text-red-600 px-6 py-2 rounded"
                >
                  Register
                </a>
              </div>
            </>
          )}

          {!loading && isLoggedIn && (
            <p className="text-gray-600 mb-8">
              Wirabhakti Academy Jaya Jaya Jaya!
            </p>
          )}
        </div>
      </main>
      <EventAndSponsorGallery />
      <Footer />
    </div>
  );
}
