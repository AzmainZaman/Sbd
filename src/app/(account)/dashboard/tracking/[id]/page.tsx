import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/actions/orders";
import { TrackingTimeline } from "@/components/dashboard/TrackingTimeline";
import { Chip } from "@/components/ui/Chip";
import { formatDate, formatBDT } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import type { ComponentProps } from "react";

export const dynamic = "force-dynamic";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const statusChip: Record<OrderStatus, { label: string; variant: ChipVariant }> =
  {
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
  backLink: "← My Orders",
  heading: "Order tracking",
  placedLabel: "Placed",
  totalLabel: "Total",
  itemsLabel: "Items",
  addressLabel: "Delivery address",
  timelineHeading: "Shipment status",
  inStockEtaLabel: "In-stock ETA",
  preOrderEtaLabel: "Pre-order ETA",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrackingPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const chip = statusChip[order.status];
  const addr = order.deliveryAddress;

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      {/* Back link */}
      <Link
        href="/dashboard/orders"
        className="text-[13px] text-muted hover:text-ink transition-colors"
      >
        {labels.backLink}
      </Link>

      {/* Order header */}
      <div className="mt-4 mb-6">
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="font-mono text-[22px] font-semibold text-ink">
            {order.id}
          </h1>
          <Chip variant={chip.variant}>{chip.label}</Chip>
        </div>
        <p className="text-[13px] text-muted mt-1">
          {labels.placedLabel} {formatDate(order.placedAt, "short")} ·{" "}
          {labels.totalLabel} {formatBDT(order.totalBDT)}
        </p>
      </div>

      {/* ETA row */}
      {(order.inStockEta || order.preOrderEta) && (
        <div className="flex gap-6 mb-6 flex-wrap">
          {order.inStockEta && (
            <div>
              <p className="text-[11px] text-muted font-medium uppercase tracking-widest">
                {labels.inStockEtaLabel}
              </p>
              <p className="font-mono text-[14px] font-semibold text-ink mt-0.5">
                {formatDate(order.inStockEta, "mono")}
              </p>
            </div>
          )}
          {order.preOrderEta && (
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                {labels.preOrderEtaLabel}
              </p>
              <p className="font-mono text-[14px] font-semibold text-ink mt-0.5">
                {formatDate(order.preOrderEta, "mono")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Items */}
      <section className="rounded-xl border border-line bg-paper px-4 py-4 mb-5">
        <p className="text-[12px] font-semibold text-muted uppercase tracking-widest mb-3">
          {labels.itemsLabel}
        </p>
        <div className="space-y-2">
          {order.lines.map((line, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-ink truncate">
                  {line.productName}
                </p>
                {line.variant && (
                  <p className="text-[12px] text-muted">{line.variant}</p>
                )}
                <p className="text-[12px] text-muted">Qty {line.quantity}</p>
              </div>
              <p className="text-[13px] font-medium text-ink shrink-0">
                {formatBDT(line.totalBDT)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery address */}
      {addr && (
        <section className="rounded-xl border border-line bg-paper px-4 py-4 mb-6">
          <p className="text-[12px] font-semibold text-muted uppercase tracking-widest mb-2">
            {labels.addressLabel}
          </p>
          <p className="text-[14px] text-ink">
            {addr.streetAddress}
            {addr.apt && `, ${addr.apt}`}
          </p>
          <p className="text-[14px] text-ink">
            {addr.area}, {addr.city} {addr.postalCode}
          </p>
          {addr.landmark && (
            <p className="text-[12px] text-muted mt-1">{addr.landmark}</p>
          )}
        </section>
      )}

      {/* Tracking timeline */}
      <section>
        <h2 className="text-[15px] font-semibold text-ink mb-4">
          {labels.timelineHeading}
        </h2>
        <TrackingTimeline steps={order.trackingSteps} />
      </section>
    </div>
  );
}
