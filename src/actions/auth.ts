"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function sendOtp(email: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) return { error: error.message };
  return {};
}

export async function sendOtpForSignup(
  email: string,
  name: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { data: { name: name.trim() } },
  });
  if (error) return { error: error.message };
  return {};
}

export async function verifyOtpAndSetName(
  email: string,
  token: string,
  name: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) return { error: error.message };
  const userId = data.user?.id;
  if (userId) {
    await supabase
      .from("users")
      .update({ name: name.trim() })
      .eq("id", userId);
  }
  return {};
}

export async function verifyOtp(
  email: string,
  token: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) return { error: error.message };
  return {};
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
