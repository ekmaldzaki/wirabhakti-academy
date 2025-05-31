"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useRoleGuard } from "@/lib/useRoleGuard";

export default function AdminPage() {
  useRoleGuard(["admin"]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Halo, Admin!</h1>
      </main>
      <Footer />
    </div>
  );
}
