import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Halo, Admin!</h1>
        <p className="text-black">Ini adalah halaman admin.</p>
      </main>
      <Footer />
    </div>
  );
}
