"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getSearchSuggestions, type SearchSuggestion } from "@/actions/products";

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
  seeAll: "See all results for",
};

export function SearchField({ initialValue = "", autoFocus, className }: SearchFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isQuoteMode = isUrl(value);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const shouldClear = !value.trim() || value.trim().length < 2 || isQuoteMode;
    const delay = shouldClear ? 0 : 250;

    debounceRef.current = setTimeout(async () => {
      if (!value.trim() || value.trim().length < 2 || isQuoteMode) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      const data = await getSearchSuggestions(value.trim());
      setSuggestions(data);
      setOpen(data.length > 0);
      setHighlighted(-1);
    }, delay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, isQuoteMode]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim()) return;
      setOpen(false);
      if (isQuoteMode) {
        router.push(`/search?url=${encodeURIComponent(value.trim())}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    },
    [value, isQuoteMode, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      const total = suggestions.length + 1; // +1 for "see all" row
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => (h + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => (h - 1 + total) % total);
      } else if (e.key === "Escape") {
        setOpen(false);
        setHighlighted(-1);
      } else if (e.key === "Enter" && highlighted >= 0) {
        e.preventDefault();
        setOpen(false);
        if (highlighted < suggestions.length) {
          router.push(`/products/${suggestions[highlighted].slug}`);
        } else {
          router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
      }
    },
    [open, suggestions, highlighted, router, value]
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div
            className={cn(
              "flex items-center rounded-xl border transition-colors",
              isQuoteMode
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : open
                ? "border-[var(--ink)] bg-paper"
                : "border-[var(--line)] bg-paper"
            )}
          >
            <span
              className="absolute left-3 flex-shrink-0"
              style={{ color: isQuoteMode ? "var(--accent)" : "var(--muted)" }}
            >
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
              onKeyDown={handleKeyDown}
              onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
              placeholder={isQuoteMode ? labels.urlPlaceholder : labels.placeholder}
              autoFocus={autoFocus}
              autoComplete="off"
              className="w-full h-12 pl-10 pr-4 text-[14px] bg-transparent text-[var(--ink)] placeholder:text-[var(--muted)] outline-none rounded-xl"
            />
          </div>

          {open && !isQuoteMode && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-[var(--paper)] border border-[var(--line)] rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/products/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    highlighted === i ? "bg-[var(--bg)]" : "hover:bg-[var(--bg)]"
                  )}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ background: s.hero }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] text-[var(--ink)] font-medium truncate">{s.name}</span>
                    <span className="block text-[12px] text-[var(--muted)] truncate">{s.brand}</span>
                  </span>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(value.trim())}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 border-t border-[var(--line)] transition-colors",
                  highlighted === suggestions.length ? "bg-[var(--bg)]" : "hover:bg-[var(--bg)]"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <span className="text-[13px] text-[var(--muted)]">{labels.seeAll} </span>
                <span className="text-[13px] text-[var(--ink)] font-medium">&ldquo;{value.trim()}&rdquo;</span>
              </Link>
            </div>
          )}
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
    </div>
  );
}
