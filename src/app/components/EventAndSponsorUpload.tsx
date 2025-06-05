"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EventAndSponsorUpload() {
  const [type, setType] = useState("event-poster");
  const [files, setFiles] = useState<FileList | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [customName, setCustomName] = useState(""); // Tambah state custom name

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage
      .from("public-assets")
      .list(type, { search: "" });

    if (error) {
      console.error("Error fetching files:", error.message);
      return;
    }

    setExistingFiles(data?.map((f) => f.name) || []);
  };

  const handleUpload = async () => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        console.warn("Skipped unsupported file type:", file.name);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        console.warn("Skipped large file:", file.name);
        continue;
      }

      // Tambahkan custom name ke nama file
      const safeCustomName = customName
        .trim()
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-");
      const filePath = `${Date.now()}___${safeCustomName || "Poster"}___${
        file.name
      }`;
      const { error } = await supabase.storage
        .from("public-assets")
        .upload(`${type}/${filePath}`, file);

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        console.log("Uploaded:", filePath);
      }
    }

    await fetchFiles();
    setFiles(null); // reset file input
    setCustomName(""); // reset custom name input
  };

  const handleDelete = async (filename: string) => {
    const { error } = await supabase.storage
      .from("public-assets")
      .remove([`${type}/${filename}`]);

    if (error) {
      console.error("Delete error:", error.message);
    }

    await fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, [type]);

  return (
    <div className="bg-white p-6 shadow rounded border max-w-xl mx-auto m-8 text-black">
      <h2 className="text-xl font-bold text-red-600 mb-4">Upload Gambar</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Tipe Gambar</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="event-poster">Poster Event</option>
          <option value="sponsor">Logo Sponsor/Media Partner</option>
        </select>
      </div>

      {/* Input custom name hanya untuk poster event */}
      {type === "event-poster" && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nama Poster (opsional)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
        </div>
      )}

      <div className="mb-4">
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold mb-4"
      >
        Upload
      </button>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">File Saat Ini:</h3>
        <ul className="space-y-2">
          {existingFiles.map((file) => (
            <li
              key={file}
              className="flex justify-between items-center border rounded px-3 py-2 bg-gray-50"
            >
              {/* Tampilkan custom name jika ada */}
              <span className="truncate">{file.split("___")[1] || file}</span>
              <button
                onClick={() => handleDelete(file)}
                className="text-red-600 hover:underline text-sm"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
