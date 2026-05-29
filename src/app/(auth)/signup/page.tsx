import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignupClient } from "./SignupClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account — SBD Global Shopping",
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(next ?? "/dashboard");

  return <SignupClient next={next} />;
}
