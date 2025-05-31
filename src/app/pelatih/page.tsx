"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeCardPelatih from "@/components/WelcomeCardPelatih";
import AbsensiSessionForm from "@/components/AbsensiSessionForm";
import AbsensiSessionListPelatih from "@/components/AbsensiSessionListPelatih";
import SppInputPelatih from "@/components/SppInputPelatih";
import SppListPelatih from "@/components/SppListPelatih";
import JadwalInputPelatih from "@/components/JadwalInputPelatih";
import JadwalListPelatih from "@/components/JadwalListPelatih";

import { useRoleGuard } from "@/lib/useRoleGuard";

const TABS = [
  { id: "beranda", label: "Beranda" },
  { id: "absensi", label: "Absensi" },
  { id: "spp", label: "SPP" },
  { id: "jadwal", label: "Jadwal" },
];

export default function PelatihPage() {
  useRoleGuard(["pelatih"]);
  const [activeTab, setActiveTab] = useState("beranda");

  const renderContent = () => {
    switch (activeTab) {
      case "beranda":
        return <WelcomeCardPelatih />;
      case "absensi":
        return (
          <>
            <AbsensiSessionForm />
            <AbsensiSessionListPelatih />
          </>
        );
      case "spp":
        return (
          <>
            <SppInputPelatih />
            <SppListPelatih />
          </>
        );
      case "jadwal":
        return (
          <>
            <JadwalInputPelatih />
            <JadwalListPelatih />
          </>
        );
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
          {/* Dropdown untuk mobile */}
          <div className="md:hidden mb-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sidebar untuk desktop */}
          <nav className="hidden md:block space-y-2">
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
        <main className="flex-grow p-6 space-y-6">{renderContent()}</main>
      </div>
      <Footer />
    </div>
  );
}
