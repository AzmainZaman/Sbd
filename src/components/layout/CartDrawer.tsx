"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatBDT } from "@/lib/utils";
import { cn } from "@/lib/utils";

const labels = {
  title: "Cart",
  closeLabel: "Close cart",
  emptyHeading: "Your cart is empty",
  emptyBody: "Add products or pre-order items to get started.",
  shopNow: "Start shopping",
  subtotal: "Subtotal",
  dutyNote: "Duties, shipping & handling calculated at checkout.",
  checkout: "Checkout",
};

export function CartDrawer() {
  const { items, removeItem, updateQty, itemCount, subtotalBDT, isOpen, closeCart } =
    useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${labels.title}${itemCount ? `, ${itemCount} items` : ""}`}
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[var(--paper)] shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--line)] shrink-0">
          <h2 className="text-[16px] font-semibold text-[var(--ink)]">
            {labels.title}
            {itemCount > 0 && (
              <span className="ml-2 text-[13px] font-normal text-[var(--muted)]">
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label={labels.closeLabel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onQtyChange={(q) => updateQty(item.id, q)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only visible when cart has items */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[var(--line)] px-5 py-4 space-y-3 bg-[var(--paper)]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--muted)]">{labels.subtotal}</span>
              <span className="text-[16px] font-semibold text-[var(--ink)]">
                {formatBDT(subtotalBDT)}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">{labels.dutyNote}</p>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button variant="primary" size="lg" className="w-full">
                {labels.checkout}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyCart() {
  const { closeCart } = useCart();
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] flex items-center justify-center mb-4">
        <Icon name="cart" size={28} className="text-[var(--muted)]" />
      </div>
      <p className="text-[15px] font-medium text-[var(--ink)] mb-1">
        {labels.emptyHeading}
      </p>
      <p className="text-[13px] text-[var(--muted)] mb-6">{labels.emptyBody}</p>
      <Link href="/" onClick={closeCart}>
        <Button variant="ghost" size="md">
          {labels.shopNow}
        </Button>
      </Link>
    </div>
  );
}

function CartLineItem({
  item,
  onRemove,
  onQtyChange,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  onRemove: () => void;
  onQtyChange: (q: number) => void;
}) {
  return (
    <li className="flex gap-3 px-5 py-4">
      {/* Image placeholder */}
      <div
        className="w-16 h-16 rounded-xl shrink-0"
        style={{ background: item.hero }}
        aria-hidden="true"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--ink)] leading-snug truncate">
          {item.productName}
        </p>
        {item.variant && (
          <p className="text-[12px] text-[var(--muted)] mt-0.5">{item.variant}</p>
        )}
        {item.eta && (
          <p className="text-[11px] text-[var(--accent)] font-mono mt-0.5">
            ETA {item.eta}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Qty stepper */}
          <div className="flex items-center border border-[var(--line)] rounded-lg overflow-hidden">
            <button
              onClick={() => onQtyChange(item.quantity - 1)}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center text-[var(--muted)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            >
              <Icon name="minus" size={12} />
            </button>
            <span className="w-7 text-center text-[13px] font-medium text-[var(--ink)]">
              {item.quantity}
            </span>
            <button
              onClick={() => onQtyChange(item.quantity + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center text-[var(--muted)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            >
              <Icon name="plus" size={12} />
            </button>
          </div>

          {/* Price + remove */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[var(--ink)]">
              {formatBDT(item.priceBDT * item.quantity)}
            </span>
            <button
              onClick={onRemove}
              aria-label={`Remove ${item.productName}`}
              className="w-6 h-6 flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
