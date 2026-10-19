"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiProdukDenganAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [nama, setNama] = useState(produk.nama ?? "");
  const [harga, setHarga] = useState(produk.harga ?? "");
  const [kategori, setKategori] = useState(produk.kategori ?? "");
  const [fotoUrl, setFotoUrl] = useState(produk.foto_url ?? "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi ?? "");
  const [sedangMembuat, setSedangMembuat] = useState(false);
  const [errorAI, setErrorAI] = useState("");

  async function buatDeskripsi() {
    setSedangMembuat(true);
    setErrorAI("");

    try {
      const hasil = await buatDeskripsiProdukDenganAI({ nama, kategori, deskripsi });
      if (hasil.error) {
        setErrorAI(hasil.error);
      } else {
        setDeskripsi(hasil.description);
      }
    } catch (error) {
      console.error("Gagal menjalankan pembuatan deskripsi AI:", error);
      setErrorAI("Deskripsi gagal dibuat. Periksa koneksi lalu coba lagi.");
    } finally {
      setSedangMembuat(false);
    }
  }

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {produk.id !== undefined && <input type="hidden" name="id" value={produk.id} />}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(event) => setNama(event.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        step="1"
        value={harga}
        onChange={(event) => setHarga(event.target.value)}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(event) => setKategori(event.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        value={fotoUrl}
        onChange={(event) => setFotoUrl(event.target.value)}
      />
      <div className="flex flex-col gap-3">
        <Input
          label="Deskripsi"
          name="deskripsi"
          textarea
          value={deskripsi}
          onChange={(event) => setDeskripsi(event.target.value)}
        />
        <Tombol
          type="button"
          varian="garis"
          onClick={buatDeskripsi}
          disabled={sedangMembuat}
          className="self-start disabled:cursor-wait disabled:opacity-60"
        >
          {sedangMembuat ? "Membuat deskripsi..." : "Buat deskripsi dengan AI"}
        </Tombol>
        <p className="text-sm text-teks-lembut">
          Tinjau dan sunting deskripsi sebelum menyimpan produk.
        </p>
        {errorAI && (
          <p role="alert" className="text-sm text-bahaya">
            {errorAI}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
