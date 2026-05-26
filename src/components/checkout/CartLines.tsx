"use client";

import { useCart } from "@/context/CartContext";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { formatBDT, formatDate } from "@/lib/utils";

const labels = {
  eta: "ETA",
  remove: "Remove",
  decrease: "Decrease quantity",
  increase: "Increase quantity",
  preOrder: "Pre-order",
  inStock: "In stock",
};

export function CartLines() {
  const { items, updateQty, removeItem } = useCart();

  if (items.length === 0) return null;

  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex gap-4 py-4 first:pt-0">
          {/* Image placeholder */}
          <div
            className="w-16 h-16 rounded-xl shrink-0"
            style={{ background: item.hero }}
            aria-hidden="true"
          />

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-ink leading-snug">{item.productName}</p>
                {item.variant && (
                  <p className="text-[12px] text-muted mt-0.5">{item.variant}</p>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                aria-label={`${labels.remove} ${item.productName}`}
                className="shrink-0 text-muted hover:text-accent transition-colors cursor-pointer"
              >
                <Icon name="trash" size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              {/* Qty stepper */}
              <div className="inline-flex items-center border border-line rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  aria-label={labels.decrease}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:bg-bg transition-colors cursor-pointer"
                >
                  <Icon name="minus" size={12} />
                </button>
                <span className="w-8 text-center text-[13px] font-medium text-ink select-none">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  aria-label={labels.increase}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:bg-bg transition-colors cursor-pointer"
                >
                  <Icon name="plus" size={12} />
                </button>
              </div>

              <span className="font-mono text-[15px] font-semibold text-ink">
                {formatBDT(item.priceBDT * item.quantity)}
              </span>
            </div>

            {/* Type chip + ETA */}
            <div className="flex items-center gap-2 mt-2">
              <Chip variant={item.type === "pre-order" ? "pre" : "stock"}>
                {item.type === "pre-order" ? labels.preOrder : labels.inStock}
              </Chip>
              {item.eta && (
                <span className="font-mono text-[11px] text-muted">
                  {labels.eta} {formatDate(item.eta, "mono")}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
