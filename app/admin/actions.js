"use server";

import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export async function loginAdmin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    redirect("/admin/login?error=credentials");
  }

  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=credentials");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  redirect("/admin/login");
}

export async function gantiPasswordAdmin(formData) {
  const password = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (typeof password !== "string" || typeof konfirmasiPassword !== "string") {
    redirect("/admin/password?status=invalid");
  }

  if (password.length < 8) {
    redirect("/admin/password?status=too-short");
  }

  if (password !== konfirmasiPassword) {
    redirect("/admin/password?status=mismatch");
  }

  const supabase = await createSupabaseSessionClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    redirect("/admin/login");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/admin/password?status=update-failed");
  }

  redirect("/admin/password?status=success");
}

export async function tambahProdukAdmin(formData) {
  const supabase = await createSupabaseSessionClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/login");
  }

  const nama = formData.get("nama");
  const hargaInput = formData.get("harga");
  const kategori = formData.get("kategori");
  const fotoUrl = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  if (typeof nama !== "string" || !nama.trim()) {
    redirect("/admin/produk/baru?status=invalid-name");
  }

  const harga =
    typeof hargaInput === "string" && hargaInput.trim() ? Number(hargaInput) : Number.NaN;
  if (!Number.isSafeInteger(harga) || harga < 0) {
    redirect("/admin/produk/baru?status=invalid-price");
  }

  if (
    (typeof kategori !== "string" && kategori !== null) ||
    (typeof fotoUrl !== "string" && fotoUrl !== null) ||
    (typeof deskripsi !== "string" && deskripsi !== null)
  ) {
    redirect("/admin/produk/baru?status=invalid-fields");
  }

  const { error } = await supabase.from("produk").insert({
    nama: nama.trim(),
    harga,
    kategori: typeof kategori === "string" && kategori.trim() ? kategori.trim() : null,
    foto_url: typeof fotoUrl === "string" && fotoUrl.trim() ? fotoUrl.trim() : null,
    deskripsi: typeof deskripsi === "string" && deskripsi.trim() ? deskripsi.trim() : null,
  });

  if (error) {
    console.error("Gagal menambahkan produk:", error);
    redirect("/admin/produk/baru?status=save-failed");
  }

  redirect("/admin?status=created");
}

export async function ubahProdukAdmin(formData) {
  const supabase = await createSupabaseSessionClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    redirect("/admin?status=invalid-update");
  }

  const editUrl = `/admin/produk/${id}/ubah`;
  const nama = formData.get("nama");
  const hargaInput = formData.get("harga");
  const kategori = formData.get("kategori");
  const fotoUrl = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  if (typeof nama !== "string" || !nama.trim()) {
    redirect(`${editUrl}?status=invalid-name`);
  }

  const harga =
    typeof hargaInput === "string" && hargaInput.trim() ? Number(hargaInput) : Number.NaN;
  if (!Number.isSafeInteger(harga) || harga < 0) {
    redirect(`${editUrl}?status=invalid-price`);
  }

  if (
    (typeof kategori !== "string" && kategori !== null) ||
    (typeof fotoUrl !== "string" && fotoUrl !== null) ||
    (typeof deskripsi !== "string" && deskripsi !== null)
  ) {
    redirect(`${editUrl}?status=invalid-fields`);
  }

  const { data, error } = await supabase
    .from("produk")
    .update({
      nama: nama.trim(),
      harga,
      kategori: typeof kategori === "string" && kategori.trim() ? kategori.trim() : null,
      foto_url: typeof fotoUrl === "string" && fotoUrl.trim() ? fotoUrl.trim() : null,
      deskripsi: typeof deskripsi === "string" && deskripsi.trim() ? deskripsi.trim() : null,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Gagal mengubah produk:", error);
    redirect(`${editUrl}?status=save-failed`);
  }

  if (!data) {
    redirect(`${editUrl}?status=not-found`);
  }

  redirect("/admin?status=updated");
}
