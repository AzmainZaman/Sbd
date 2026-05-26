"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selected: string | null;
  onSelect: (id: string) => void;
  label?: string;
};

export function VariantSelector({
  variants,
  selected,
  onSelect,
  label = "Select option",
}: VariantSelectorProps) {
  return (
    <div>
      <p className="text-[13px] font-medium text-muted mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => v.available && onSelect(v.id)}
            disabled={!v.available}
            className={cn(
              "h-9 px-4 rounded-xl text-[13px] font-medium border transition-all",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:line-through",
              selected === v.id
                ? "bg-ink text-paper border-ink"
                : "bg-paper text-ink border-line hover:border-ink"
            )}
          >
            {v.name}
            {v.priceDelta && v.priceDelta > 0 ? (
              <span className="ml-1 text-muted text-[11px]">+৳{v.priceDelta.toLocaleString()}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
