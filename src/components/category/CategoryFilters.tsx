"use client";

import { cn } from "@/lib/utils";

export type FilterState = {
  countries: string[];
  status: string[];
  priceMax: number | null;
};

type CategoryFiltersProps = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
};

const countryOptions = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "EU", label: "Europe" },
  { value: "CN", label: "China" },
  { value: "AU", label: "Australia" },
  { value: "AE", label: "UAE" },
];

const statusOptions = [
  { value: "in-stock", label: "In stock" },
  { value: "pre-order", label: "Pre-order" },
];

const priceOptions = [
  { value: 5000, label: "Under ৳5,000" },
  { value: 15000, label: "Under ৳15,000" },
  { value: 30000, label: "Under ৳30,000" },
  { value: null, label: "All prices" },
];

const labels = {
  title: "Filters",
  country: "Origin",
  status: "Availability",
  price: "Price",
  reset: "Reset all",
};

export function CategoryFilters({ filters, onChange }: CategoryFiltersProps) {
  function toggleCountry(val: string) {
    const next = filters.countries.includes(val)
      ? filters.countries.filter((c) => c !== val)
      : [...filters.countries, val];
    onChange({ ...filters, countries: next });
  }

  function toggleStatus(val: string) {
    const next = filters.status.includes(val)
      ? filters.status.filter((s) => s !== val)
      : [...filters.status, val];
    onChange({ ...filters, status: next });
  }

  function reset() {
    onChange({ countries: [], status: [], priceMax: null });
  }

  const hasFilters =
    filters.countries.length > 0 || filters.status.length > 0 || filters.priceMax !== null;

  return (
    <aside className="w-[220px] flex-shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-ink">{labels.title}</h3>
        {hasFilters && (
          <button
            onClick={reset}
            className="text-[12px] font-medium hover:opacity-70 transition-opacity"
            style={{ color: "var(--accent)" }}
          >
            {labels.reset}
          </button>
        )}
      </div>

      <FilterGroup label={labels.country}>
        {countryOptions.map((o) => (
          <CheckItem
            key={o.value}
            label={o.label}
            checked={filters.countries.includes(o.value)}
            onChange={() => toggleCountry(o.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={labels.status}>
        {statusOptions.map((o) => (
          <CheckItem
            key={o.value}
            label={o.label}
            checked={filters.status.includes(o.value)}
            onChange={() => toggleStatus(o.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={labels.price}>
        {priceOptions.map((o) => (
          <label
            key={String(o.value)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <input
              type="radio"
              name="price"
              checked={filters.priceMax === o.value}
              onChange={() => onChange({ ...filters, priceMax: o.value })}
              className="accent-ink"
            />
            <span className="text-[13px] text-ink group-hover:text-muted transition-colors">
              {o.label}
            </span>
          </label>
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-5 space-y-2.5">
      <p className="text-[12px] font-semibold text-muted uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
          checked ? "bg-ink border-ink" : "bg-paper border-line group-hover:border-ink"
        )}
        onClick={onChange}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-ink" onClick={onChange}>
        {label}
      </span>
    </label>
  );
}
