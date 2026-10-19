import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProdukAdmin } from "@/app/admin/actions";

const pesanStatus = {
  "invalid-name": "Nama produk wajib diisi.",
  "invalid-price": "Harga wajib berupa bilangan bulat nol atau lebih.",
  "invalid-fields": "Data produk tidak valid. Periksa kembali isian form.",
  "save-failed": "Produk gagal disimpan. Periksa data dan koneksi, lalu coba lagi.",
};

export default async function HalamanTambahProduk({ searchParams }) {
  const params = await searchParams;
  const status = params?.status;
  const pesanError =
    typeof status === "string" && Object.hasOwn(pesanStatus, status)
      ? pesanStatus[status]
      : undefined;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      {pesanError && (
        <p role="alert" className="text-bahaya">
          {pesanError}
        </p>
      )}
      <FormProduk action={tambahProdukAdmin} labelTombol="Simpan produk" />
    </div>
  );
}
