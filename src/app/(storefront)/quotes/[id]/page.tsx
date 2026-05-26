import { getQuote } from "@/actions/quotes";
import { QuoteThreadClient } from "./QuoteThreadClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuotePage({ params }: PageProps) {
  const { id } = await params;
  const quote = await getQuote(id);
  return <QuoteThreadClient quote={quote} />;
}
