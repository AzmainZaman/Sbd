import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { formatDate, formatBDT } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { Order, OrderStatus } from "@/types/order";
import type { ComponentProps } from "react";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const statusMap: Record<OrderStatus, { label: string; variant: ChipVariant }> =
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

type OrderRowProps = {
  order: Order;
};

export function OrderRow({ order }: OrderRowProps) {
  const chip = statusMap[order.status];
  const firstLine = order.lines[0];
  const extraCount = order.lines.length - 1;

  return (
    <div className="flex items-start gap-4 px-4 py-4 rounded-xl border border-line bg-paper">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-mono text-[13px] font-medium text-ink">
            {order.id}
          </p>
          <Chip variant={chip.variant}>{chip.label}</Chip>
        </div>
        <p className="text-[14px] text-ink font-medium truncate">
          {firstLine.productName}
          {firstLine.variant && (
            <span className="text-muted font-normal"> · {firstLine.variant}</span>
          )}
        </p>
        {extraCount > 0 && (
          <p className="text-[12px] text-muted">
            +{extraCount} more item{extraCount > 1 ? "s" : ""}
          </p>
        )}
        <p className="text-[12px] text-muted mt-0.5">
          {formatDate(order.placedAt, "short")} · {formatBDT(order.totalBDT)}
        </p>
      </div>
      <Link
        href={`/dashboard/tracking/${order.id}`}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-ink transition-colors shrink-0 mt-0.5"
      >
        Track
        <Icon name="chevron-right" size={14} strokeWidth={2} />
      </Link>
    </div>
  );
}
