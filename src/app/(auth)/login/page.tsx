import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginClient } from "./LoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — SBD Global Shopping",
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(next ?? "/dashboard");

  return <LoginClient next={next} />;
}
