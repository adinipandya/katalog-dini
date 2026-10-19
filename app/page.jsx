import FilterProduk from "@/components/FilterProduk";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export default async function HalamanKatalog() {
  let daftarProduk;
  let gagalMemuat = false;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori");

    if (error) {
      throw error;
    }

    daftarProduk = data;
  } catch (error) {
    console.error("Gagal mengambil daftar produk:", error);
    gagalMemuat = true;
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>
        {gagalMemuat ? (
          <p role="alert" className="text-bahaya">
            Produk tidak dapat dimuat saat ini. Silakan coba lagi beberapa saat lagi.
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">Belum ada produk</p>
        ) : (
          <FilterProduk daftarProduk={daftarProduk} />
        )}
      </section>
    </>
  );
}
