import Link from "next/link";
import { quotes } from "@/data/quotes";
import { QuoteListItem } from "@/components/dashboard/QuoteListItem";
import { Button } from "@/components/ui/Button";

const labels = {
  heading: "My Quotes",
  sub: "Review quotes sent by the SBD team and request new ones.",
  empty: "No quotes yet.",
  emptySub: "Paste a product URL and we'll source it for you.",
  emptyBtn: "Request a quote",
  activeHeading: "Awaiting action",
  pastHeading: "Past",
};

const activeStatuses = new Set(["pending", "quote-sent", "customer-replied"]);

export default function QuotesPage() {
  const myQuotes = quotes.filter((q) => q.customerId === "cust-001");
  const active = myQuotes.filter((q) => activeStatuses.has(q.status));
  const past = myQuotes.filter((q) => !activeStatuses.has(q.status));

  if (myQuotes.length === 0) {
    return (
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <h1 className="text-[24px] font-semibold text-ink mb-1">
          {labels.heading}
        </h1>
        <p className="text-[14px] text-muted mb-8">{labels.sub}</p>
        <div className="rounded-2xl border border-line bg-paper px-6 py-10 text-center">
          <p className="text-[16px] font-semibold text-ink mb-1">
            {labels.empty}
          </p>
          <p className="text-[13px] text-muted mb-4">{labels.emptySub}</p>
          <Link href="/search">
            <Button variant="accent" size="md">
              {labels.emptyBtn}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-semibold text-ink">{labels.heading}</h1>
        <Link href="/search">
          <Button variant="accent" size="sm">
            + New quote
          </Button>
        </Link>
      </div>
      <p className="text-[14px] text-muted mb-6">{labels.sub}</p>

      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[13px] font-semibold text-muted uppercase tracking-widest mb-3">
            {labels.activeHeading}
          </h2>
          <div className="space-y-2">
            {active.map((quote) => (
              <QuoteListItem key={quote.id} quote={quote} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold text-muted uppercase tracking-widest mb-3">
            {labels.pastHeading}
          </h2>
          <div className="space-y-2">
            {past.map((quote) => (
              <QuoteListItem key={quote.id} quote={quote} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
