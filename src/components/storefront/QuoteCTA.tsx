"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const RETAILERS = ["Amazon", "eBay", "Apple", "Nike", "Adidas", "Dyson"];

const labels = {
  eyebrow: "Can't find what you're looking for?",
  heading: "We'll source it for you.",
  sub: "Paste any product link from Amazon, eBay, Apple, and more — we'll send a price quote within 24 hours.",
  placeholder: "https://www.amazon.com/dp/...",
  cta: "Get a quote",
  worksWithLabel: "Works with",
  andMore: "and more",
};

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function QuoteCTA() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUrl(url)) return;
    router.push(`/dashboard/quotes/new?url=${encodeURIComponent(url.trim())}`);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").trim();
    if (isValidUrl(pasted)) {
      setUrl(pasted);
      router.push(`/dashboard/quotes/new?url=${encodeURIComponent(pasted)}`);
    }
  }

  return (
    <section className="bg-paper border-y border-[var(--line)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-[680px] mx-auto text-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
            {labels.eyebrow}
          </p>
          <h2 className="text-[32px] lg:text-[40px] font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
            {labels.heading}
          </h2>
          <p className="text-[15px] lg:text-[16px] text-[var(--muted)] leading-relaxed mb-8 max-w-[520px] mx-auto">
            {labels.sub}
          </p>

          {/* URL input */}
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-[560px] mx-auto mb-5">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={handlePaste}
              placeholder={labels.placeholder}
              className="flex-1 h-12 px-4 rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={!isValidUrl(url)}
            >
              {labels.cta}
            </Button>
          </form>

          {/* Retailer chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[12px] text-[var(--muted)]">{labels.worksWithLabel}</span>
            {RETAILERS.map((r) => (
              <Chip key={r} variant="line">
                {r}
              </Chip>
            ))}
            <span className="text-[12px] text-[var(--muted)]">{labels.andMore}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
