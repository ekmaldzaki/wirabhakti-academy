import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeCardSiswa from "@/components/WelcomeCardSiswa";
import ListAbsensiToFill from "@/components/ListAbsensiToFill";

export default function SiswaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-start text-center p-8 space-y-6">
        <WelcomeCardSiswa />
        <ListAbsensiToFill />
      </main>
      <Footer />
    </div>
  );
}
