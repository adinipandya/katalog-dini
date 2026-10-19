import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export default async function HalamanAdmin() {
  const supabase = await createSupabaseSessionClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/login");
  }

  let daftarProduk;
  let gagalMemuat = false;

  try {
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori");

    if (error) {
      throw error;
    }

    daftarProduk = data;
  } catch (error) {
    console.error("Gagal mengambil daftar produk admin:", error);
    gagalMemuat = true;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {gagalMemuat ? (
        <p role="alert" className="text-bahaya">
          Daftar produk gagal dimuat. Periksa koneksi dan konfigurasi Supabase, lalu coba lagi.
        </p>
      ) : daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
