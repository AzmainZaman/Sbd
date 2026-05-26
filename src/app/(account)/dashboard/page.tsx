import Link from "next/link";
import { orders } from "@/data/orders";
import { quotes } from "@/data/quotes";
import { StatCard } from "@/components/dashboard/StatCard";
import { NextShipmentCard } from "@/components/dashboard/NextShipmentCard";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { formatBDT, formatDate } from "@/lib/utils";

const labels = {
  greeting: "Welcome back, Nuzhat",
  statOrders: "Total orders",
  statQuoteReady: "Quotes ready",
  statPending: "Pending quotes",
  activeQuoteHeading: "You have a quote waiting",
  activeQuoteSub: "Review and accept before it expires.",
  activeQuoteCta: "Review quote",
  recentOrders: "Recent orders",
  viewAllOrders: "View all orders",
  noOrders: "No orders yet",
  quoteCta: "Want something specific?",
  quoteCtaSub:
    "Paste a product URL from any US or UK retailer and we'll source it for you.",
  quoteCtaBtn: "Request a quote",
};

export default function DashboardPage() {
  const myOrders = orders.filter((o) => o.customerId === "cust-001");
  const myQuotes = quotes.filter((q) => q.customerId === "cust-001");

  const readyQuotes = myQuotes.filter((q) => q.status === "quote-sent");
  const pendingQuotes = myQuotes.filter((q) => q.status === "pending");
  const activeQuote = readyQuotes[0] ?? null;
  const recentOrders = myOrders.slice(0, 2);

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      {/* Greeting */}
      <h1 className="text-[24px] font-semibold text-ink mb-6">
        {labels.greeting}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label={labels.statOrders} value={myOrders.length} />
        <StatCard
          label={labels.statQuoteReady}
          value={readyQuotes.length}
          sub={readyQuotes.length > 0 ? "Action needed" : undefined}
        />
        <StatCard label={labels.statPending} value={pendingQuotes.length} />
      </div>

      {/* Active quote alert */}
      {activeQuote && (
        <div
          className="rounded-xl border px-4 py-4 mb-6"
          style={{
            borderColor: "var(--accent)",
            backgroundColor: "var(--accent-soft)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Chip variant="accent">Quote ready</Chip>
                {activeQuote.expiresAt && (
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    Expires {formatDate(activeQuote.expiresAt, "short")}
                  </span>
                )}
              </div>
              <p className="text-[14px] font-semibold text-ink">
                {labels.activeQuoteHeading}
              </p>
              <p className="text-[13px] text-muted mt-0.5">
                {activeQuote.productName}
                {activeQuote.totalBDT != null && (
                  <> · {formatBDT(activeQuote.totalBDT)}</>
                )}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: "var(--accent)" }}
              >
                {labels.activeQuoteSub}
              </p>
            </div>
            <Link href={`/quotes/${activeQuote.id}`} className="shrink-0">
              <Button variant="accent" size="sm">
                {labels.activeQuoteCta}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Next shipment */}
      <div className="mb-6">
        <NextShipmentCard />
      </div>

      {/* Recent orders */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-ink">
            {labels.recentOrders}
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-[13px] text-muted hover:text-ink transition-colors"
          >
            {labels.viewAllOrders}
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-[14px] text-muted">{labels.noOrders}</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* Quote prompt */}
      <div className="rounded-2xl border border-line bg-paper px-6 py-5 text-center">
        <p className="text-[16px] font-semibold text-ink mb-1">
          {labels.quoteCta}
        </p>
        <p className="text-[13px] text-muted mb-4">{labels.quoteCtaSub}</p>
        <Link href="/search">
          <Button variant="accent" size="md">
            {labels.quoteCtaBtn}
          </Button>
        </Link>
      </div>
    </div>
  );
}
