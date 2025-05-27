import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeCardPelatih from "@/components/WelcomeCardPelatih";
import AbsensiSessionForm from "@/components/AbsensiSessionForm";
import AbsensiSessionListPelatih from "@/components/AbsensiSessionListPelatih";
import SppInputPelatih from "@/components/SppInputPelatih";
import SppListPelatih from "@/components/SppListPelatih";
import JadwalInputPelatih from "@/components/JadwalInputPelatih";
import JadwalListPelatih from "@/components/JadwalListPelatih";

export default function PelatihPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-start text-center p-8 space-y-6">
        <WelcomeCardPelatih />
        <AbsensiSessionForm />
        <AbsensiSessionListPelatih />
        <SppInputPelatih />
        <SppListPelatih />
        <JadwalInputPelatih />
        <JadwalListPelatih />
      </main>
      <Footer />
    </div>
  );
}
