"use client";
import { useState } from "react";
import { Image, Wallet } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventAndSponsorUpload from "@/components/EventAndSponsorUpload";
import SppInputPelatih from "@/app/components/SppInput";
import SppListPelatih from "@/app/components/SppList";

import { useRoleGuard } from "@/lib/useRoleGuard";

const TABS = [
  { id: "poster", label: "Gambar", icon: Image },
  { id: "spp", label: "SPP", icon: Wallet },
];

export default function AdminPage() {
  useRoleGuard(["admin"]);
  const [activeTab, setActiveTab] = useState("poster");

  const renderContent = () => {
    switch (activeTab) {
      case "poster":
        return (
          <>
            <EventAndSponsorUpload />
          </>
        );
      case "spp":
        return (
          <>
            <SppInputPelatih />
            <SppListPelatih />
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

        {/* Main Content */}
        <main className="flex-grow p-6 space-y-6 text-center">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
