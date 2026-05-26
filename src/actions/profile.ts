"use server";

import { createClient } from "@/lib/supabase/server";
import { assertAuth } from "@/lib/auth-guard";

export type Profile = {
  name: string;
  phone: string | null;
  email: string;
};

export async function getProfile(): Promise<Profile | null> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data } = await supabase
    .from("users")
    .select("name, phone, email")
    .eq("id", user.id)
    .single();

  return data ?? null;
}

export async function updateProfile(name: string, phone: string | null): Promise<void> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ name: name.trim(), phone: phone?.trim() || null })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}
