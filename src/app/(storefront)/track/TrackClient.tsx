import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { TrackingTimeline } from "@/components/dashboard/TrackingTimeline";
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
  heading: "Track your orders",
  placedOn: "Placed on",
  total: "Total",
  inStockEta: "In-stock ETA",
  preOrderEta: "Pre-order ETA",
  timeline: "Shipment status",
  noOrders: "No orders yet",
  noOrdersSub: "When you place an order, you'll be able to track it here.",
  shopNow: "Shop now",
  requestQuote: "Request a quote",
  loginHeading: "Sign in to track your orders",
  loginSub: "See live shipment status, ETAs, and delivery updates for all your orders.",
  signIn: "Sign in",
};

function OrderCard({ order }: { order: Order }) {
  const chip = statusChip[order.status];
  return (
    <div className="rounded-2xl border border-line bg-paper overflow-hidden">
      {/* Order header */}
      <div className="px-5 py-4 border-b border-line">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">
              Order ID
            </p>
            <p className="font-mono text-[20px] font-semibold text-ink">{order.id}</p>
          </div>
          <Chip variant={chip.variant}>{chip.label}</Chip>
        </div>

        <p className="mt-2 text-[13px] text-muted">
          {labels.placedOn} {formatDate(order.placedAt, "short")} · {labels.total}{" "}
          {formatBDT(order.totalBDT)}
        </p>

        {(order.inStockEta || order.preOrderEta) && (
          <div className="mt-3 flex gap-6 flex-wrap">
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

      {/* Timeline */}
      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-4">
          {labels.timeline}
        </p>
        <TrackingTimeline steps={order.trackingSteps} />
      </div>
    </div>
  );
}

export function TrackOrdersView({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="max-w-120 mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "var(--paper)", border: "1.5px solid var(--line)" }}
        >
          <svg
            viewBox="0 0 24 24"
            width={28}
            height={28}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--ink)" }}
            aria-hidden="true"
          >
            <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
            <path d="M16.5 9.4 7.55 4.24" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
            <circle cx="18.5" cy="15.5" r="2.5" />
            <path d="M20.27 17.27 22 19" />
          </svg>
        </div>

        <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink tracking-tight mb-3">
          {labels.noOrders}
        </h1>
        <p className="text-[15px] text-muted leading-relaxed mb-8 max-w-85 mx-auto">
          {labels.noOrdersSub}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/categories">
            <Button variant="primary" size="lg">{labels.shopNow}</Button>
          </Link>
          <Link href="/dashboard/quotes/new">
            <Button variant="accent" size="lg">{labels.requestQuote}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <h1 className="text-[32px] sm:text-[40px] font-semibold text-ink tracking-tight mb-8">
        {labels.heading}
      </h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export function TrackLoginPrompt() {
  return (
    <div className="max-w-120 mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "var(--bg)", border: "1.5px solid var(--line)" }}
      >
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--ink)" }}
          aria-hidden="true"
        >
          <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <circle cx="12" cy="12" r="0.5" fill="currentColor" />
        </svg>
      </div>

      <h1 className="text-[28px] sm:text-[32px] font-semibold text-ink tracking-tight mb-3">
        {labels.loginHeading}
      </h1>
      <p className="text-[15px] text-muted leading-relaxed mb-8">{labels.loginSub}</p>

      <Link href="/login?next=/track">
        <Button variant="accent" size="lg">{labels.signIn}</Button>
      </Link>
    </div>
  );
}
