"use client";

import { useState, type FormEvent } from "react";
import { orders } from "@/data/orders";
import { TrackingTimeline } from "@/components/dashboard/TrackingTimeline";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { formatDate, formatBDT } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";
import type { ComponentProps } from "react";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const statusChip: Record<OrderStatus, { label: string; variant: ChipVariant }> = {
  placed: { label: "Placed", variant: "default" },
  sourcing: { label: "Sourcing", variant: "default" },
  outbound: { label: "Outbound", variant: "dark" },
  "in-transit": { label: "In transit", variant: "dark" },
  customs: { label: "Customs", variant: "default" },
  "out-for-delivery": { label: "Out for delivery", variant: "stock" },
  delivered: { label: "Delivered", variant: "stock" },
  cancelled: { label: "Cancelled", variant: "line" },
};

const labels = {
  heading: "Track your order",
  sub: "Enter your SBD order ID to see real-time shipment status.",
  placeholder: "e.g. SBD-2026-04812",
  inputLabel: "Order ID",
  cta: "Track",
  notFound: "Order not found",
  notFoundSub:
    "Check your order ID and try again. You can find it in your confirmation email or dashboard.",
  tryAnother: "Try another ID",
  placedOn: "Placed on",
  total: "Total",
  statusLabel: "Shipment status",
  inStockEta: "In-stock ETA",
  preOrderEta: "Pre-order ETA",
  hint: "Try",
};

function ResultCard({ order }: { order: Order }) {
  const chip = statusChip[order.status];
  return (
    <div className="mt-8 animate-in fade-in duration-300">
      {/* Order header */}
      <div className="rounded-2xl border border-line bg-paper p-5 mb-4">
        <div className="flex items-start gap-3 flex-wrap justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">
              Order ID
            </p>
            <p className="font-mono text-[20px] font-semibold text-ink">
              {order.id}
            </p>
          </div>
          <Chip variant={chip.variant}>{chip.label}</Chip>
        </div>

        <p className="mt-2 text-[13px] text-muted">
          {labels.placedOn} {formatDate(order.placedAt, "short")} ·{" "}
          {labels.total} {formatBDT(order.totalBDT)}
        </p>

        {/* ETAs */}
        {(order.inStockEta || order.preOrderEta) && (
          <div className="mt-4 flex gap-6 flex-wrap">
            {order.inStockEta && (
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">
                  {labels.inStockEta}
                </p>
                <p className="font-mono text-[13px] font-semibold text-ink mt-0.5">
                  {formatDate(order.inStockEta, "mono")}
                </p>
              </div>
            )}
            {order.preOrderEta && (
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  {labels.preOrderEta}
                </p>
                <p className="font-mono text-[13px] font-semibold text-ink mt-0.5">
                  {formatDate(order.preOrderEta, "mono")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tracking timeline */}
      <div className="rounded-2xl border border-line bg-paper p-5">
        <p className="text-[12px] font-semibold text-muted uppercase tracking-widest mb-4">
          {labels.statusLabel}
        </p>
        <TrackingTimeline steps={order.trackingSteps} />
      </div>
    </div>
  );
}

function NotFound({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8 text-center py-14 rounded-2xl border border-dashed border-line">
      <p className="text-[16px] font-medium text-ink">{labels.notFound}</p>
      <p className="mt-2 text-[14px] text-muted max-w-[340px] mx-auto leading-relaxed">
        {labels.notFoundSub}
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-[13px] font-medium underline underline-offset-2 cursor-pointer"
        style={{ color: "var(--accent)" }}
      >
        {labels.tryAnother}
      </button>
    </div>
  );
}

export function TrackClient() {
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Order | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === q) ?? null;
    setResult(found);
    setSearched(true);
  }

  function handleReset() {
    setInput("");
    setSearched(false);
    setResult(null);
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Page header */}
      <h1 className="text-[36px] sm:text-[48px] font-semibold text-ink tracking-tight">
        {labels.heading}
      </h1>
      <p className="mt-2 text-[15px] text-muted">{labels.sub}</p>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mt-8" noValidate>
        <label
          htmlFor="order-id-input"
          className="block text-[12px] font-semibold text-muted uppercase tracking-widest mb-2"
        >
          {labels.inputLabel}
        </label>
        <div className="flex gap-2">
          <input
            id="order-id-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={labels.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 h-11 px-4 rounded-xl border border-line bg-paper text-[14px] font-mono text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-[var(--ink)] transition"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={input.trim().length < 5}
          >
            {labels.cta}
          </Button>
        </div>
        <p className="mt-2 text-[12px] text-muted">
          {labels.hint}{" "}
          <button
            type="button"
            className="font-mono underline underline-offset-2 cursor-pointer"
            onClick={() => setInput("SBD-2026-04812")}
          >
            SBD-2026-04812
          </button>
        </p>
      </form>

      {/* Results */}
      {searched && (
        result ? (
          <ResultCard order={result} />
        ) : (
          <NotFound onReset={handleReset} />
        )
      )}
    </div>
  );
}
