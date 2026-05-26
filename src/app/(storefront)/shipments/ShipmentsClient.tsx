"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { formatCountdown } from "@/lib/shipment-utils";
import type { Shipment, ShipmentStatus } from "@/types/shipment";

const labels = {
  heading: "Shipment Schedule",
  sub: "Track every shipment from sourcing to your doorstep.",
  tabUS: "USA → Dhaka",
  tabUK: "UK → Dhaka",
  cutoff: "Cutoff",
  liftoff: "Departure",
  landing: "Est. arrival",
  items: "items",
  accepting: "Accepting orders",
  cutoffPassed: "Cutoff passed",
  preOrderCta: "Pre-order now",
  milestonesLabel: "Journey",
  breakdownLabel: "Breakdown",
  closingIn: "Closes in",
  emptyHeading: "No shipments yet",
  emptySub: "Shipments for this route will appear here once scheduled.",
};

type TabRoute = "US" | "UK";

const statusChipMap: Record<
  ShipmentStatus,
  { label: string; variant: "stock" | "pre" | "accent" | "line" | "dark" | "default" }
> = {
  accepting: { label: "Accepting orders", variant: "stock" },
  cutoff: { label: "Cutoff passed", variant: "line" },
  outbound: { label: "In transit", variant: "dark" },
  "in-transit": { label: "In transit", variant: "dark" },
  customs: { label: "Customs", variant: "dark" },
  delivery: { label: "Out for delivery", variant: "pre" },
  delivered: { label: "Delivered", variant: "line" },
};

function MilestoneTrack({ milestones }: { milestones: Shipment["milestones"] }) {
  const total = milestones.length;
  const done = milestones.filter((m) => m.completedAt).length;

  return (
    <div>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-2">
        {labels.milestonesLabel}
      </p>
      <div className="flex items-center gap-0">
        {milestones.map((m, i) => {
          const isDone = Boolean(m.completedAt);
          const isCurrent = !isDone && i === done;
          const isLast = i === total - 1;

          return (
            <div key={m.label} className="flex items-center" style={{ flex: isLast ? "0 0 auto" : 1 }}>
              {/* Node */}
              <div className="flex flex-col items-center gap-0.5 shrink-0">
                <div
                  className="w-3 h-3 rounded-full border transition-colors"
                  style={{
                    backgroundColor: isDone
                      ? "var(--ok)"
                      : isCurrent
                      ? "var(--ink)"
                      : "var(--paper)",
                    borderColor: isDone
                      ? "var(--ok)"
                      : isCurrent
                      ? "var(--ink)"
                      : "var(--line)",
                  }}
                />
                <p
                  className="text-[10px] leading-tight text-center max-w-[60px] whitespace-nowrap hidden sm:block"
                  style={{ color: isDone || isCurrent ? "var(--ink)" : "var(--muted)", opacity: isDone || isCurrent ? 1 : 0.5 }}
                >
                  {m.label}
                </p>
              </div>
              {/* Connector */}
              {!isLast && (
                <div
                  className="h-px flex-1 mx-0.5"
                  style={{ backgroundColor: isDone ? "var(--ok)" : "var(--line)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShipmentCard({ shipment, now }: { shipment: Shipment; now: number }) {
  const chip = statusChipMap[shipment.status];
  const cutoffMs = new Date(shipment.cutoffDate).getTime() - now;
  const isAccepting = shipment.status === "accepting" && cutoffMs > 0;
  const isDelivered = shipment.status === "delivered";

  return (
    <article
      className="rounded-2xl border border-line bg-paper overflow-hidden"
      aria-label={`Shipment #${shipment.number} ${shipment.route}`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-line">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono text-[11px] text-muted tracking-widest uppercase">
              {shipment.route}
            </p>
            <h2 className="text-[20px] font-semibold text-ink mt-0.5">
              Shipment #{shipment.number}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAccepting && (
              <span className="font-mono text-[11px] text-muted">
                {labels.closingIn} {formatCountdown(cutoffMs)}
              </span>
            )}
            <Chip variant={chip.variant}>{chip.label}</Chip>
          </div>
        </div>

        {/* Dates row */}
        <div className="mt-4 flex gap-6 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">
              {labels.cutoff}
            </p>
            <p className="font-mono text-[13px] text-ink mt-0.5">
              {formatDate(shipment.cutoffDate, "mono")}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">
              {labels.liftoff}
            </p>
            <p className="font-mono text-[13px] text-ink mt-0.5">
              {formatDate(shipment.liftoffDate, "mono")}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">
              {labels.landing}
            </p>
            <p
              className="font-mono text-[13px] mt-0.5"
              style={{ color: isDelivered ? "var(--ok)" : "var(--ink)" }}
            >
              {formatDate(shipment.landingDate, "mono")}
            </p>
          </div>
          {shipment.itemCount > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">
                Items
              </p>
              <p className="font-mono text-[13px] text-ink mt-0.5">
                {shipment.itemCount} {labels.items}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="px-5 pt-4 pb-4">
        <MilestoneTrack milestones={shipment.milestones} />
      </div>

      {/* Breakdown + CTA */}
      {(shipment.breakdown || isAccepting) && (
        <div className="px-5 pb-5 flex items-end justify-between gap-4 flex-wrap">
          {/* Category breakdown */}
          {shipment.breakdown && shipment.breakdown.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">
                {labels.breakdownLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {shipment.breakdown.map((cat) => (
                  <span
                    key={cat.category}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-line text-muted"
                  >
                    {cat.category}
                    <span className="font-mono text-[10px] opacity-70">{cat.itemCount}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pre-order CTA */}
          {isAccepting && (
            <Link href="/products" className="shrink-0">
              <Button variant="accent" size="sm">
                {labels.preOrderCta}
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Customer note */}
      {shipment.customerNote && (
        <div
          className="mx-5 mb-5 px-4 py-3 rounded-xl text-[13px] text-ink"
          style={{ backgroundColor: "var(--accent-soft)" }}
        >
          {shipment.customerNote}
        </div>
      )}
    </article>
  );
}

export function ShipmentsClient({ shipments }: { shipments: Shipment[] }) {
  const [route, setRoute] = useState<TabRoute>("US");
  const [now] = useState(() => Date.now());

  const filtered = shipments
    .filter((s) => s.originCountry === route)
    .sort((a, b) => b.number - a.number);

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[36px] sm:text-[48px] font-semibold text-ink tracking-tight">
          {labels.heading}
        </h1>
        <p className="mt-2 text-[15px] text-muted">{labels.sub}</p>
      </div>

      {/* Route tabs */}
      <div
        className="inline-flex rounded-xl border border-line bg-paper p-1 mb-8"
        role="tablist"
        aria-label="Shipment routes"
      >
        {(["US", "UK"] as TabRoute[]).map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={route === r}
            onClick={() => setRoute(r)}
            className="px-5 h-9 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: route === r ? "var(--ink)" : "transparent",
              color: route === r ? "var(--paper)" : "var(--muted)",
            }}
          >
            {r === "US" ? labels.tabUS : labels.tabUK}
          </button>
        ))}
      </div>

      {/* Shipment cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-line rounded-2xl">
          <p className="text-[16px] font-medium text-ink">{labels.emptyHeading}</p>
          <p className="mt-2 text-[14px] text-muted">{labels.emptySub}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((s) => (
            <ShipmentCard key={s.id} shipment={s} now={now} />
          ))}
        </div>
      )}
    </div>
  );
}
