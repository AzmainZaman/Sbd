"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  type AdminOrder,
} from "@/actions/admin/orders";
import { Chip } from "@/components/ui/Chip";
import { formatDate, formatBDT } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
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

const paymentChip: Record<string, { label: string; variant: ChipVariant }> = {
  paid: { label: "Paid", variant: "stock" },
  pending: { label: "Pending", variant: "default" },
  failed: { label: "Failed", variant: "line" },
  refunded: { label: "Refunded", variant: "line" },
};

const ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "sourcing",
  "outbound",
  "in-transit",
  "customs",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

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
  loading: "Loading orders…",
  empty: "No orders yet.",
};

function StatusSelect({
  orderId,
  current,
  onUpdated,
}: {
  orderId: string;
  current: OrderStatus;
  onUpdated: (id: string, status: OrderStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      onUpdated(orderId, next);
    });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="text-[12px] rounded-lg border border-line bg-bg px-2 py-1 text-ink focus:outline-none focus:ring-2 focus:ring-ink disabled:opacity-50"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {statusChip[s].label}
        </option>
      ))}
    </select>
  );
}

function PaymentSelect({
  orderId,
  current,
  onUpdated,
}: {
  orderId: string;
  current: PaymentStatus;
  onUpdated: (id: string, status: PaymentStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as PaymentStatus;
    startTransition(async () => {
      await updatePaymentStatus(orderId, next);
      onUpdated(orderId, next);
    });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="text-[12px] rounded-lg border border-line bg-bg px-2 py-1 text-ink focus:outline-none focus:ring-2 focus:ring-ink disabled:opacity-50"
    >
      {PAYMENT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {paymentChip[s].label}
        </option>
      ))}
    </select>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  function handleStatusUpdated(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }

  function handlePaymentUpdated(id: string, paymentStatus: PaymentStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o))
    );
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-[20px] font-semibold text-ink mb-1">{labels.heading}</h1>
      <p className="text-[13px] text-muted mb-6">{labels.sub}</p>

      {loading ? (
        <p className="text-[13px] text-muted">{labels.loading}</p>
      ) : orders.length === 0 ? (
        <p className="text-[13px] text-muted">{labels.empty}</p>
      ) : (
        <div className="rounded-xl border border-line bg-paper overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line bg-bg">
                {[
                  labels.colId,
                  labels.colCustomer,
                  labels.colDate,
                  labels.colItems,
                  labels.colTotal,
                  labels.colPayment,
                  labels.colStatus,
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
              {orders.map((order, i) => {
                const isLast = i === orders.length - 1;
                const chip = statusChip[order.status];
                const payChip =
                  paymentChip[order.paymentStatus] ?? {
                    label: order.paymentStatus,
                    variant: "default" as ChipVariant,
                  };

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-bg transition-colors ${isLast ? "" : "border-b border-line"}`}
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3">
                      <p className="font-mono text-[12px] font-medium text-ink">
                        {order.id}
                      </p>
                      <p className="text-[11px] text-muted mt-0.5 capitalize">
                        {order.type}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="text-ink font-medium">{order.customerName}</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        {order.customerEmail}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {formatDate(order.placedAt, "short")}
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3">
                      <p className="text-ink truncate max-w-40">
                        {order.lines[0]?.productName ?? "—"}
                      </p>
                      {order.lines.length > 1 && (
                        <p className="text-muted text-[11px]">
                          +{order.lines.length - 1} more
                        </p>
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 font-mono text-ink whitespace-nowrap">
                      {formatBDT(order.totalBDT)}
                    </td>

                    {/* Payment status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <Chip variant={payChip.variant}>{payChip.label}</Chip>
                        <PaymentSelect
                          orderId={order.id}
                          current={order.paymentStatus as PaymentStatus}
                          onUpdated={handlePaymentUpdated}
                        />
                      </div>
                    </td>

                    {/* Order status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <Chip variant={chip.variant}>{chip.label}</Chip>
                        <StatusSelect
                          orderId={order.id}
                          current={order.status}
                          onUpdated={handleStatusUpdated}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
