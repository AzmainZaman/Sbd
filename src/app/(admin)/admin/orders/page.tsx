import Link from "next/link";
import { orders } from "@/data/orders";
import { Chip } from "@/components/ui/Chip";
import { formatDate, formatBDT } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import type { ComponentProps } from "react";

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

const paymentChip: Record<string, { label: string; variant: ChipVariant }> = {
  paid: { label: "Paid", variant: "stock" },
  pending: { label: "Pending", variant: "default" },
  failed: { label: "Failed", variant: "line" },
  refunded: { label: "Refunded", variant: "line" },
};

const labels = {
  heading: "Orders",
  sub: "All customer orders across all fulfillment states.",
  colId: "Order ID",
  colCustomer: "Customer",
  colDate: "Placed",
  colItems: "Items",
  colTotal: "Total",
  colPayment: "Payment",
  colStatus: "Status",
  colTrack: "",
};

export default function AdminOrdersPage() {
  const sorted = [...orders].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );

  return (
    <div className="px-6 py-8">
      <h1 className="text-[20px] font-semibold text-ink mb-1">
        {labels.heading}
      </h1>
      <p className="text-[13px] text-muted mb-6">{labels.sub}</p>

      <div className="rounded-xl border border-line bg-paper overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-line bg-bg">
              {[
                labels.colId,
                labels.colDate,
                labels.colItems,
                labels.colTotal,
                labels.colPayment,
                labels.colStatus,
                labels.colTrack,
              ].map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((order, i) => {
              const chip = statusChip[order.status];
              const payChip = paymentChip[order.paymentStatus] ?? { label: order.paymentStatus, variant: "default" as ChipVariant };
              const isLast = i === sorted.length - 1;

              return (
                <tr
                  key={order.id}
                  className={`hover:bg-bg transition-colors ${isLast ? "" : "border-b border-line"}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-[12px] font-medium text-ink">
                      {order.id}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      {order.type}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {formatDate(order.placedAt, "short")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink truncate max-w-[180px]">
                      {order.lines[0].productName}
                    </p>
                    {order.lines.length > 1 && (
                      <p className="text-muted text-[11px]">
                        +{order.lines.length - 1} more
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink whitespace-nowrap">
                    {formatBDT(order.totalBDT)}
                  </td>
                  <td className="px-4 py-3">
                    <Chip variant={payChip.variant}>{payChip.label}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip variant={chip.variant}>{chip.label}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/tracking/${order.id}`}
                      className="text-[12px] text-muted hover:text-ink transition-colors"
                    >
                      Track →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
