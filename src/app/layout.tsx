import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// ✅ Font Google
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ✅ Metadata SEO & Social Tags
export const metadata: Metadata = {
  title: "Wirabhakti Academy",
  description: "Website resmi Wirabhakti Academy.",
  metadataBase: new URL("https://wirabhakti-academy.vercel.app"),
  keywords: [
    "Wirabhakti",
    "Wirabhakti Academy",
    "bela diri",
    "pelatihan",
    "siswa",
    "pelatih",
    "silat",
  ],
  authors: [
    {
      name: "Wirabhakti Academy",
      url: "https://wirabhakti-academy.vercel.app",
    },
  ],
  openGraph: {
    title: "Wirabhakti Academy",
    description: "Website resmi Wirabhakti Academy.",
    url: "https://wirabhakti-academy.vercel.app",
    siteName: "Wirabhakti Academy",
    type: "website",
    locale: "id_ID",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* ✅ Favicon */}
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </head>
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
