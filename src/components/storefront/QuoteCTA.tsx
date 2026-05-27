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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
        className="relative rounded-3xl overflow-hidden px-8 py-12 lg:px-16 lg:py-16"
        style={{ background: "var(--ink)" }}
      >
        {/* Background accent blob */}
        <div
          className="absolute top-0 right-0 w-75 h-75 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative max-w-140 mx-auto text-center">
          <span className="text-[11px] font-mono font-semibold tracking-widest text-paper/50">
            {labels.eyebrow}
          </span>
          <h2 className="mt-3 text-[32px] lg:text-[40px] font-semibold text-paper leading-tight">
            {labels.heading}
          </h2>
          <p className="mt-4 text-[15px] text-paper/70 leading-relaxed max-w-110 mx-auto">
            {labels.sub}
          </p>

          {/* URL input */}
          <form onSubmit={handleSubmit} className="mt-8 flex gap-2 max-w-120 mx-auto">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={handlePaste}
              placeholder={labels.placeholder}
              className="flex-1 h-12 px-4 rounded-xl border text-[14px] text-paper placeholder:text-paper/40 focus:outline-none focus:border-paper/40 transition-colors"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <Button type="submit" variant="accent" size="md">
              {labels.cta}
            </Button>
          </form>

          {/* Retailer chips */}
          <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[12px] text-paper/40">{labels.worksWithLabel}</span>
            {RETAILERS.map((r) => (
              <Chip key={r} variant="line" className="border-white/20 text-paper/60">
                {r}
              </Chip>
            ))}
            <span className="text-[12px] text-paper/40">{labels.andMore}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
