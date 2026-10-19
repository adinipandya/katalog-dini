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
