"use client";

import { Chip } from "@/components/ui/Chip";
import type { FilterState } from "./CategoryFilters";

type ActiveFilterChipsProps = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
};

const countryLabels: Record<string, string> = {
  US: "USA", UK: "UK", EU: "Europe", CN: "China", AU: "Australia", AE: "UAE",
};

const statusLabels: Record<string, string> = {
  "in-stock": "In stock",
  "pre-order": "Pre-order",
};

export function ActiveFilterChips({ filters, onChange }: ActiveFilterChipsProps) {
  const hasAny =
    filters.countries.length > 0 || filters.status.length > 0 || filters.priceMax !== null;

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filters.countries.map((c) => (
        <Chip
          key={c}
          variant="line"
          className="cursor-pointer hover:bg-line transition-colors"
          onClick={() =>
            onChange({ ...filters, countries: filters.countries.filter((x) => x !== c) })
          }
        >
          {countryLabels[c] ?? c}
          <span className="ml-1 text-muted">✕</span>
        </Chip>
      ))}
      {filters.status.map((s) => (
        <Chip
          key={s}
          variant="line"
          className="cursor-pointer hover:bg-line transition-colors"
          onClick={() =>
            onChange({ ...filters, status: filters.status.filter((x) => x !== s) })
          }
        >
          {statusLabels[s] ?? s}
          <span className="ml-1 text-muted">✕</span>
        </Chip>
      ))}
      {filters.priceMax !== null && (
        <Chip
          variant="line"
          className="cursor-pointer hover:bg-line transition-colors"
          onClick={() => onChange({ ...filters, priceMax: null })}
        >
          Under ৳{filters.priceMax.toLocaleString()}
          <span className="ml-1 text-muted">✕</span>
        </Chip>
      )}
      <button
        onClick={() => onChange({ countries: [], status: [], priceMax: null })}
        className="text-[12px] font-medium hover:opacity-70 transition-opacity"
        style={{ color: "var(--accent)" }}
      >
        Clear all
      </button>
    </div>
  );
}
