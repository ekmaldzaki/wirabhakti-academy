"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeCardSiswa from "@/components/WelcomeCardSiswa";
import ListAbsensiToFill from "@/components/ListAbsensiToFill";
import SppSiswaView from "@/components/SppViewSiswa";
import JadwalViewSiswa from "@/components/JadwalViewSiswa";

import { useRoleGuard } from "@/lib/useRoleGuard";

const TABS = [
  { id: "beranda", label: "Beranda" },
  { id: "absensi", label: "Absensi" },
  { id: "spp", label: "SPP" },
  { id: "jadwal", label: "Jadwal" },
];

export default function SiswaPage() {
  useRoleGuard(["siswa"]);
  const [activeTab, setActiveTab] = useState("beranda");

  const renderContent = () => {
    switch (activeTab) {
      case "beranda":
        return <WelcomeCardSiswa />;
      case "absensi":
        return <ListAbsensiToFill />;
      case "spp":
        return <SppSiswaView />;
      case "jadwal":
        return <JadwalViewSiswa />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-100 border-r p-4">
          <nav className="space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white font-semibold"
                    : "hover:bg-gray-200 text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow p-6">{renderContent()}</main>
      </div>
      <Footer />
    </div>
  );
}
