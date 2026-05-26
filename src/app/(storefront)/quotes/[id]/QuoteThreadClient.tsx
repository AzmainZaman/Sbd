"use client";

import Link from "next/link";
import { QuoteThread } from "@/components/quote/QuoteThread";
import type { Quote } from "@/types/quote";

const labels = {
  backLabel: "← My quotes",
  heading: "Quote details",
  notFound: "Quote not found",
  notFoundDesc: "This quote doesn't exist or may have been removed.",
};

type QuoteThreadClientProps = {
  quote: Quote | null;
};

export function QuoteThreadClient({ quote }: QuoteThreadClientProps) {
  if (!quote) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-[24px] font-semibold text-[var(--ink)] mb-2">{labels.notFound}</p>
        <p className="text-[14px] text-[var(--muted)]">{labels.notFoundDesc}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/dashboard/quotes"
        className="inline-flex items-center text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-6"
      >
        {labels.backLabel}
      </Link>
      <h1 className="text-[28px] lg:text-[32px] font-semibold text-[var(--ink)] mb-6">
        {labels.heading}
      </h1>
      <div className="max-w-[560px]">
        <QuoteThread quote={quote} />
      </div>
    </div>
  );
}
