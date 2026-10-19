"use client";

import { hapusProdukAdmin } from "@/app/admin/actions";

export default function TombolHapusProduk({ produkId, namaProduk }) {
  function konfirmasiHapus(event) {
    if (!window.confirm(`Yakin ingin menghapus produk "${namaProduk}"?`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={hapusProdukAdmin} onSubmit={konfirmasiHapus}>
      <input type="hidden" name="id" value={produkId} />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-bahaya transition-colors hover:border-bahaya"
      >
        Hapus
      </button>
    </form>
  );
}
