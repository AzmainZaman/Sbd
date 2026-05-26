"use client";

import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/order";

const labels = {
  heading: "Payment method",
  codDisabledTooltip: "Available for in-stock items only",
};

type PaymentOption = {
  id: PaymentMethod;
  name: string;
  desc: string;
  color: string;
  abbr: string;
};

const paymentOptions: PaymentOption[] = [
  { id: "bkash", name: "bKash", desc: "Mobile banking", color: "#E2006A", abbr: "bK" },
  { id: "nagad", name: "Nagad", desc: "Mobile banking", color: "#F7941D", abbr: "Ng" },
  { id: "card", name: "Card", desc: "Visa · Mastercard · Amex", color: "#1B4FBB", abbr: "$$" },
  { id: "cod", name: "Cash on delivery", desc: "In-stock orders only", color: "#1f8a5b", abbr: "COD" },
];

type PaymentSelectorProps = {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  hasPreOrder: boolean;
};

export function PaymentSelector({ value, onChange, hasPreOrder }: PaymentSelectorProps) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-ink mb-3">{labels.heading}</h3>
      <div className="grid grid-cols-2 gap-2">
        {paymentOptions.map((opt) => {
          const isCodDisabled = opt.id === "cod" && hasPreOrder;
          const isSelected = value === opt.id;

          return (
            <div key={opt.id} className="relative group">
              <button
                type="button"
                onClick={() => !isCodDisabled && onChange(opt.id)}
                aria-pressed={isSelected}
                disabled={isCodDisabled}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3 transition-colors",
                  isCodDisabled
                    ? "opacity-40 cursor-not-allowed border-line bg-paper"
                    : "cursor-pointer",
                  isSelected
                    ? "border-ink bg-paper shadow-sm ring-1 ring-ink"
                    : !isCodDisabled && "border-line bg-paper hover:border-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Brand swatch */}
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: opt.color }}
                    aria-hidden="true"
                  >
                    {opt.abbr}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-ink leading-tight">{opt.name}</p>
                    <p className="text-[11px] text-muted leading-tight">{opt.desc}</p>
                  </div>
                </div>
              </button>

              {/* COD tooltip */}
              {isCodDisabled && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-[11px] text-paper whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  style={{ backgroundColor: "var(--ink)" }}
                  role="tooltip"
                >
                  {labels.codDisabledTooltip}
                  <span
                    className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                    style={{ borderTopColor: "var(--ink)" }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
