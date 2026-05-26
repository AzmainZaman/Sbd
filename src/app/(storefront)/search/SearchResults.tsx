"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchField } from "@/components/search/SearchField";
import { ProductCard } from "@/components/product/ProductCard";
import { QuoteRequestForm, type QuoteFormData } from "@/components/quote/QuoteRequestForm";
import { QuoteRequestStep2 } from "@/components/quote/QuoteRequestStep2";
import { products } from "@/data/products";

const labels = {
  heading: "Search",
  quoteHeading: "Request a quote",
  noResults: "No products found for",
  tryBrowsing: "Try browsing our categories instead.",
  results: "results for",
  empty: "Start typing to search, or paste a product URL to request a custom quote.",
};

type QuoteStep = "form" | "review";

/**
 * Manages step state for the two-step quote request flow.
 * Rendered with key={detectedUrl} in the parent so state resets automatically
 * whenever the URL in the search bar changes.
 */
function QuoteFlow({ detectedUrl }: { detectedUrl: string }) {
  const [quoteStep, setQuoteStep] = useState<QuoteStep>("form");
  const [formData, setFormData] = useState<QuoteFormData | null>(null);

  if (quoteStep === "form") {
    return (
      <QuoteRequestForm
        initialUrl={detectedUrl}
        onNext={(data) => {
          setFormData(data);
          setQuoteStep("review");
        }}
      />
    );
  }

  if (formData) {
    return (
      <QuoteRequestStep2
        data={formData}
        onBack={() => setQuoteStep("form")}
        onSuccess={() => {}}
      />
    );
  }

  return null;
}

function isUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const urlParam = searchParams.get("url") ?? "";

  const isQuoteMode = !!urlParam || isUrl(q);
  const detectedUrl = urlParam || (isUrl(q) ? q : "");

  const results =
    q && !isQuoteMode
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.brand.toLowerCase().includes(q.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
        )
      : [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-[28px] lg:text-[32px] font-semibold text-[var(--ink)] mb-6">
        {isQuoteMode ? labels.quoteHeading : labels.heading}
      </h1>

      {!isQuoteMode && (
        <SearchField initialValue={q} autoFocus className="mb-8 max-w-[680px]" />
      )}

      {isQuoteMode ? (
        // key forces QuoteFlow to remount when the URL changes, resetting step state
        <QuoteFlow key={detectedUrl} detectedUrl={detectedUrl} />
      ) : q ? (
        <>
          <p className="text-[14px] text-[var(--muted)] mb-6">
            {results.length} {labels.results} &ldquo;{q}&rdquo;
          </p>
          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[16px] text-[var(--muted)]">
                {labels.noResults} &ldquo;{q}&rdquo;
              </p>
              <p className="mt-2 text-[14px] text-[var(--muted)]">{labels.tryBrowsing}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-[14px] text-[var(--muted)]">{labels.empty}</p>
      )}
    </div>
  );
}
