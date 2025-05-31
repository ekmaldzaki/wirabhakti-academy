"use client";
import { useState } from "react";
import { Home, ClipboardList, Wallet, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeCardSiswa from "@/components/WelcomeCardSiswa";
import ListAbsensiToFill from "@/components/ListAbsensiToFill";
import SppSiswaView from "@/components/SppViewSiswa";
import JadwalViewSiswa from "@/components/JadwalViewSiswa";
import { useRoleGuard } from "@/lib/useRoleGuard";

const TABS = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "absensi", label: "Absensi", icon: ClipboardList },
  { id: "spp", label: "SPP", icon: Wallet },
  { id: "jadwal", label: "Jadwal", icon: Calendar },
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
        <aside className="w-full md:w-64 bg-gray-100 border-r p-4 flex md:flex-col gap-4 justify-between md:justify-start">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 w-full px-4 py-2 rounded ${
                activeTab === id
                  ? "bg-red-600 text-white font-semibold"
                  : "hover:bg-gray-200 text-black"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-grow p-6">{renderContent()}</main>
      </div>

      <Footer />
    </div>
  );
}
