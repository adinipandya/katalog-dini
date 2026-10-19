"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function PesanProdukDenganJumlah({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const pesan = `Halo, saya ingin memesan ${produk.nama} dengan harga ${formatRupiah(produk.harga)}. Jumlah: ${jumlah}.`;
  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3 border-t border-garis p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">Jumlah</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Kurangi jumlah ${produk.nama}`}
            onClick={() => setJumlah((jumlahSaatIni) => Math.max(1, jumlahSaatIni - 1))}
            disabled={jumlah === 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-garis text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            −
          </button>
          <output aria-live="polite" className="min-w-6 text-center font-semibold">
            {jumlah}
          </output>
          <button
            type="button"
            aria-label={`Tambah jumlah ${produk.nama}`}
            onClick={() => setJumlah((jumlahSaatIni) => jumlahSaatIni + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-garis text-lg font-semibold"
          >
            +
          </button>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-utama px-3 py-2 text-center text-sm font-semibold text-white hover:bg-utama-gelap"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
