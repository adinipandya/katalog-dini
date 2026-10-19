"use client";

import { useMemo, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function FilterProduk({ daftarProduk }) {
  const [kataKunci, setKataKunci] = useState("");
  const [kategoriPilihan, setKategoriPilihan] = useState("");

  const kategori = useMemo(
    () =>
      [...new Set(daftarProduk.map((produk) => produk.kategori).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "id"),
      ),
    [daftarProduk],
  );

  const produkCocok = useMemo(() => {
    const kataKunciNormal = kataKunci.trim().toLocaleLowerCase("id");

    return daftarProduk.filter((produk) => {
      const cocokKategori = !kategoriPilihan || produk.kategori === kategoriPilihan;
      const cocokKataKunci =
        !kataKunciNormal ||
        `${produk.nama} ${produk.deskripsi ?? ""}`.toLocaleLowerCase("id").includes(kataKunciNormal);

      return cocokKategori && cocokKataKunci;
    });
  }, [daftarProduk, kataKunci, kategoriPilihan]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Cari produk
          <input
            type="search"
            value={kataKunci}
            onChange={(event) => setKataKunci(event.target.value)}
            placeholder="Cari nama atau deskripsi"
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Kategori
          <select
            value={kategoriPilihan}
            onChange={(event) => setKategoriPilihan(event.target.value)}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
          >
            <option value="">Semua kategori</option>
            {kategori.map((namaKategori) => (
              <option key={namaKategori} value={namaKategori}>
                {namaKategori}
              </option>
            ))}
          </select>
        </label>
      </div>

      {produkCocok.length === 0 ? (
        <p className="text-teks-lembut">Tidak ada produk yang cocok dengan pencarian atau kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkCocok.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
