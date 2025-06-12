import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wirabhakti Academy | Akademi Olahraga Lumajang",
  description:
    "Wirabhakti Academy adalah akademi olahraga di Kabupaten Lumajang untuk cabang basket, futsal, dan sepak bola. Siap membentuk atlet-atlet berkualitas dan berdaya saing.",
  metadataBase: new URL("https://wirabhakti-academy.vercel.app"),
  keywords: [
    "Wirabhakti",
    "Wirabhakti Academy",
    "akademi olahraga",
    "basket Lumajang",
    "futsal Lumajang",
    "sepak bola Lumajang",
    "atlet Lumajang",
    "pelatihan olahraga",
    "akademi basket",
    "akademi futsal",
    "akademi sepak bola",
    "pembinaan atlet",
    "olahraga Lumajang",
    "kabupaten Lumajang",
  ],
  authors: [
    {
      name: "Wirabhakti Academy",
      url: "https://wirabhakti-academy.vercel.app",
    },
  ],
  openGraph: {
    title: "Wirabhakti Academy | Akademi Olahraga Lumajang",
    description:
      "Akademi olahraga di Kabupaten Lumajang untuk basket, futsal, dan sepak bola. Membentuk atlet-atlet berkualitas dan siap bersaing.",
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
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </head>
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
