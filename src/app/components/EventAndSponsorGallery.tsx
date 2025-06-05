"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface StorageImage {
  name: string;
  url: string;
}

export default function EventAndSponsorGallery() {
  const [posters, setPosters] = useState<StorageImage[]>([]);
  const [sponsors, setSponsors] = useState<StorageImage[]>([]);

  const fetchImages = async () => {
    try {
      const [posterRes, sponsorRes] = await Promise.all([
        supabase.storage
          .from("public-assets")
          .list("event-poster", { search: "" }),
        supabase.storage.from("public-assets").list("sponsor", { search: "" }),
      ]);

      const buildUrls = (folder: string, files: any[]) =>
        files?.map((file: any) => ({
          name: file.name,
          url: supabase.storage
            .from("public-assets")
            .getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
        })) || [];

      if (posterRes.data) setPosters(buildUrls("event-poster", posterRes.data));
      if (sponsorRes.data) setSponsors(buildUrls("sponsor", sponsorRes.data));
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Fungsi untuk menampilkan custom name dengan spasi
  const getDisplayName = (fileName: string) => {
    const parts = fileName.split("___");
    if (parts.length === 3) {
      return parts[1];
    }
    return fileName;
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto space-y-10 text-black">
      {/* Poster Event */}
      <div>
        <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">
          Poster Event
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {posters.map((poster, index) => (
            <div
              key={index}
              className="bg-white rounded shadow overflow-hidden flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
                <Image
                  src={poster.url}
                  alt={getDisplayName(poster.name)}
                  fill
                  style={{ objectFit: "contain" }}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 w-full text-center">
                <h3 className="text-xl font-semibold">
                  {getDisplayName(poster.name)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Sponsor dan Media Partner */}
      <div>
        <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">
          Sponsor & Media Partner
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sponsors.map((logo, index) => (
            <div
              key={index}
              className="bg-white rounded shadow p-3 flex items-center justify-center"
            >
              <div className="relative w-28 h-20">
                <Image
                  src={logo.url}
                  alt="Logo Sponsor"
                  fill
                  style={{ objectFit: "contain" }}
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
