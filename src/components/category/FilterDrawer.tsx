"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { CategoryFilters, type FilterState } from "./CategoryFilters";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
};

const labels = {
  title: "Filters",
  apply: "Apply",
  reset: "Reset",
};

export function FilterDrawer({ open, onClose, filters, onChange }: FilterDrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40"
          onClick={onClose}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 bg-paper rounded-t-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85dvh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="text-[16px] font-semibold text-ink">{labels.title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-line transition-colors"
            aria-label="Close filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(85dvh - 130px)" }}>
          <CategoryFilters filters={filters} onChange={onChange} />
        </div>

        <div className="px-5 py-4 border-t border-line flex gap-3">
          <Button
            variant="ghost"
            size="md"
            className="flex-1"
            onClick={() => onChange({ countries: [], status: [], priceMax: null })}
          >
            {labels.reset}
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
            {labels.apply}
          </Button>
        </div>
      </div>
    </>
  );
}
