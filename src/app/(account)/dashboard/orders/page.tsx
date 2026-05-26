import Link from "next/link";
import { getOrdersByCustomer } from "@/actions/orders";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const labels = {
  heading: "My Orders",
  sub: "Track and manage all your orders.",
  emptyHeading: "No orders yet",
  emptySub: "Your orders will appear here once you place one.",
  emptyBtn: "Start shopping",
  activeHeading: "Active",
  pastHeading: "Past",
};

const activeStatuses = new Set([
  "placed",
  "sourcing",
  "outbound",
  "in-transit",
  "customs",
  "out-for-delivery",
]);

export default async function OrdersPage() {
  const myOrders = await getOrdersByCustomer();
  const active = myOrders.filter((o) => activeStatuses.has(o.status));
  const past = myOrders.filter((o) => !activeStatuses.has(o.status));

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="text-[24px] font-semibold text-ink mb-1">{labels.heading}</h1>
      <p className="text-[14px] text-muted mb-6">{labels.sub}</p>

      {myOrders.length === 0 && (
        <EmptyState
          heading={labels.emptyHeading}
          sub={labels.emptySub}
          action={
            <Link href="/">
              <Button variant="primary" size="md">{labels.emptyBtn}</Button>
            </Link>
          }
        />
      )}

      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[13px] font-semibold text-muted uppercase tracking-widest mb-3">
            {labels.activeHeading}
          </h2>
          <div className="space-y-2">
            {active.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold text-muted uppercase tracking-widest mb-3">
            {labels.pastHeading}
          </h2>
          <div className="space-y-2">
            {past.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
