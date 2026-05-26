"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function isUrl(str: string): boolean {
  try {
    const u = new URL(str.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type SearchFieldProps = {
  initialValue?: string;
  autoFocus?: boolean;
  className?: string;
};

const labels = {
  placeholder: "Search products or paste a product URL…",
  urlPlaceholder: "Product URL detected — request a quote",
  searchBtn: "Search",
  quoteBtn: "Request quote",
};

export function SearchField({ initialValue = "", autoFocus, className }: SearchFieldProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const isQuoteMode = isUrl(value);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim()) return;
      if (isQuoteMode) {
        router.push(`/search?url=${encodeURIComponent(value.trim())}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    },
    [value, isQuoteMode, router]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <div className={cn(
        "relative flex-1 flex items-center rounded-xl border transition-colors",
        isQuoteMode
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-line bg-paper"
      )}>
        <span className="absolute left-3 flex-shrink-0" style={{ color: isQuoteMode ? "var(--accent)" : "var(--muted)" }}>
          {isQuoteMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          )}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isQuoteMode ? labels.urlPlaceholder : labels.placeholder}
          autoFocus={autoFocus}
          className="w-full h-12 pl-10 pr-4 text-[14px] bg-transparent text-ink placeholder-muted outline-none rounded-xl"
        />
      </div>
      <Button
        variant={isQuoteMode ? "accent" : "primary"}
        size="md"
        type="submit"
        className="whitespace-nowrap h-12"
      >
        {isQuoteMode ? labels.quoteBtn : labels.searchBtn}
      </Button>
    </form>
  );
}
