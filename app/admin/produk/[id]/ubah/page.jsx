import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProdukAdmin } from "@/app/admin/actions";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

const pesanStatus = {
  "invalid-name": "Nama produk wajib diisi.",
  "invalid-price": "Harga wajib berupa bilangan bulat nol atau lebih.",
  "invalid-fields": "Data produk tidak valid. Periksa kembali isian form.",
  "save-failed": "Perubahan gagal disimpan. Periksa data dan koneksi, lalu coba lagi.",
  "not-found": "Produk tidak ditemukan atau tidak dapat diubah.",
};

export default async function HalamanUbahProduk({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const status = query?.status;
  const pesanError =
    typeof status === "string" && Object.hasOwn(pesanStatus, status)
      ? pesanStatus[status]
      : undefined;
  const supabase = await createSupabaseSessionClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/login");
  }

  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil produk untuk diubah:", error);
    return (
      <div className="flex flex-col gap-6 py-8">
        <NavAdmin />
        <h1 className="text-2xl font-extrabold">Ubah produk</h1>
        <p role="alert" className="text-bahaya">
          Data produk gagal dimuat. Periksa koneksi, lalu coba lagi.
        </p>
      </div>
    );
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      {pesanError && (
        <p role="alert" className="text-bahaya">
          {pesanError}
        </p>
      )}
      <FormProduk action={ubahProdukAdmin} produk={produk} labelTombol="Simpan perubahan" />
    </div>
  );
}
