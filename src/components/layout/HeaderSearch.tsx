"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { getSearchSuggestions, type SearchSuggestion } from "@/actions/products";

const labels = {
  placeholder: "Search or paste a product URL…",
  searchLabel: "Go to search",
  seeAll: "See all results for",
};

export function HeaderSearch() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim() || value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await getSearchSuggestions(value.trim());
      setSuggestions(data);
      setOpen(data.length > 0);
      setHighlighted(-1);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

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
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    },
    [value, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      const total = suggestions.length + 1;
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
    <div ref={containerRef} className="flex-1 max-w-lg relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
            placeholder={labels.placeholder}
            autoComplete="off"
            className={cn(
              "w-full h-10 pl-4 pr-10 rounded-xl border bg-bg",
              "text-[14px] text-ink placeholder:text-muted",
              "focus:outline-none focus:bg-paper transition-colors",
              open ? "border-ink bg-paper" : "border-line"
            )}
          />
          <button
            type="submit"
            aria-label={labels.searchLabel}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <Icon name="search" size={16} />
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-[var(--paper)] border border-[var(--line)] rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <Link
              key={s.id}
              href={`/products/${s.slug}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 transition-colors",
                highlighted === i ? "bg-[var(--bg)]" : "hover:bg-[var(--bg)]"
              )}
            >
              <span
                className="w-7 h-7 rounded-lg flex-shrink-0"
                style={{ background: s.hero }}
              />
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] text-[var(--ink)] font-medium truncate">{s.name}</span>
                <span className="block text-[11px] text-[var(--muted)] truncate">{s.brand}</span>
              </span>
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(value.trim())}`}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 border-t border-[var(--line)] transition-colors",
              highlighted === suggestions.length ? "bg-[var(--bg)]" : "hover:bg-[var(--bg)]"
            )}
          >
            <Icon name="search" size={13} />
            <span className="text-[12px] text-[var(--muted)]">{labels.seeAll} </span>
            <span className="text-[12px] text-[var(--ink)] font-medium">&ldquo;{value.trim()}&rdquo;</span>
          </Link>
        </div>
      )}
    </div>
  );
}
