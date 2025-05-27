import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeCardSiswa from "@/components/WelcomeCardSiswa";
import ListAbsensiToFill from "@/components/ListAbsensiToFill";
import SppSiswaView from "@/components/SppViewSiswa";

export default function SiswaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-start text-center p-8 space-y-6">
        <WelcomeCardSiswa />
        <ListAbsensiToFill />
        <SppSiswaView />
      </main>
      <Footer />
    </div>
  );
}
