import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth-guard";
import { formatBDT } from "@/lib/utils";

const labels = {
  heading: "Overview",
  pendingQuotes: "Pending quotes",
  openOrders: "Open orders",
  paidRevenue: "Paid revenue",
  activeShipments: "Active shipments",
};

async function getStats() {
  const supabase = await createClient();

  const [quotesRes, ordersRes, revenueRes, shipmentsRes] = await Promise.all([
    supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .not("status", "in", '("delivered","cancelled")'),
    supabase
      .from("orders")
      .select("total_bdt")
      .eq("payment_status", "paid"),
    supabase
      .from("shipments")
      .select("*", { count: "exact", head: true })
      .neq("status", "delivered"),
  ]);

  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum, row) => sum + (row.total_bdt ?? 0),
    0
  );

  return {
    pendingQuotes: quotesRes.count ?? 0,
    openOrders: ordersRes.count ?? 0,
    totalRevenueBDT: totalRevenue,
    activeShipments: shipmentsRes.count ?? 0,
  };
}

export default async function AdminPage() {
  await assertAdmin();
  const stats = await getStats();

  const cards = [
    { label: labels.pendingQuotes, value: String(stats.pendingQuotes), href: "/admin/quotes" },
    { label: labels.openOrders, value: String(stats.openOrders), href: "/admin/orders" },
    { label: labels.paidRevenue, value: formatBDT(stats.totalRevenueBDT), href: "/admin/orders" },
    { label: labels.activeShipments, value: String(stats.activeShipments), href: "/admin/shipments" },
  ];

  return (
    <div className="px-6 py-8">
      <h1 className="text-[20px] font-semibold text-ink mb-6">{labels.heading}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-line bg-paper px-5 py-5 hover:border-ink transition-colors block"
          >
            <p className="text-[12px] font-semibold text-muted uppercase tracking-wide mb-2">
              {card.label}
            </p>
            <p className="text-[28px] font-semibold text-ink leading-none">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
