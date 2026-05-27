import type { Metadata } from "next";
import { QuoteRequestClient } from "./QuoteRequestClient";

export const metadata: Metadata = {
  title: "Request a quote — SBD Global Shopping",
};

type PageProps = {
  searchParams: Promise<{ url?: string }>;
};

export default async function NewQuotePage({ searchParams }: PageProps) {
  const { url } = await searchParams;
  return <QuoteRequestClient initialUrl={url ?? ""} />;
}
