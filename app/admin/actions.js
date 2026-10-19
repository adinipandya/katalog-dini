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
