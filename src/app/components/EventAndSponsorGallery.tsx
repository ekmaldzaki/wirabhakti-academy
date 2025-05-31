"use client";
import Image from "next/image";

interface Poster {
  title: string;
  filename: string;
}

interface Logo {
  filename: string;
}

export default function EventAndSponsorGallery() {
  const posters: Poster[] = [
    { title: "Poster Event 1", filename: "poster-1.jpg" },
    { title: "Poster Event 2", filename: "poster-2.jpg" },
  ];

  const sponsors: Logo[] = [
    { filename: "logo-1.jpg" },
    { filename: "logo-2.jpg" },
    { filename: "logo-3.jpg" },
    { filename: "logo-4.jpg" },
  ];

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
              {/* Gunakan rasio A4: 3:4 */}
              <div className="relative w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
                <Image
                  src={`/images/${poster.filename}`}
                  alt={poster.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 w-full text-center">
                <h3 className="text-xl font-semibold">{poster.title}</h3>
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
                  src={`/images/${logo.filename}`}
                  alt="Logo Sponsor"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
