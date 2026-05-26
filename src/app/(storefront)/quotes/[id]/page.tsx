import { quotes } from "@/data/quotes";
import { QuoteThreadClient } from "./QuoteThreadClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuotePage({ params }: PageProps) {
  const { id } = await params;
  const quote = quotes.find((q) => q.id === id) ?? null;
  return <QuoteThreadClient quote={quote} />;
}

export function generateStaticParams() {
  return quotes.map((q) => ({ id: q.id }));
}
