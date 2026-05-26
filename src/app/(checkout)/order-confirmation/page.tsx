import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { shipments } from "@/data/shipments";

const labels = {
  heading: "Order placed!",
  subheading: "Thank you for your order. We'll start sourcing your items right away.",
  orderIdLabel: "Order reference",
  inStockCard: "In-stock items",
  inStockEta: "Estimated delivery",
  inStockNote: "2–5 business days after customs clearance",
  preOrderCard: "Pre-order items",
  preOrderVia: "Arrives with",
  preOrderEta: "Expected arrival",
  whatsNext: "What happens next",
  steps: [
    { label: "Sourcing", desc: "We purchase your items from verified US/UK retailers." },
    { label: "Ships from origin", desc: "Items leave the source country and head to Bangladesh." },
    { label: "Dhaka customs", desc: "Package clears customs. Duties are settled on your behalf." },
    { label: "Delivered", desc: "Your courier delivers to your address." },
  ],
  trackOrder: "Track my order",
  continueShopping: "Continue shopping",
  whatsappHelp: "Questions? Message us on WhatsApp",
};

type PageProps = {
  searchParams: Promise<{
    id?: string;
    stock?: string;
    pre?: string;
    preEta?: string;
    shipmentId?: string;
  }>;
};

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.id ?? `SBD-${new Date().getFullYear()}-DEMO`;
  const hasStock = params.stock === "1";
  const hasPre = params.pre === "1";
  const preEta = params.preEta;
  const shipmentId = params.shipmentId;

  const shipment = shipmentId ? shipments.find((s) => s.id === shipmentId) : null;

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 lg:py-16">

      {/* Checkmark + heading */}
      <div className="text-center mb-10">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "var(--ok-soft)" }}
        >
          <svg
            viewBox="0 0 24 24"
            width={28}
            height={28}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--ok)" }}
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-[32px] font-semibold text-ink mb-2">{labels.heading}</h1>
        <p className="text-[15px] text-muted">{labels.subheading}</p>
      </div>

      {/* Order ID */}
      <div className="rounded-2xl border border-line bg-paper px-6 py-4 mb-6 text-center">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">
          {labels.orderIdLabel}
        </p>
        <p className="font-mono text-[22px] font-semibold text-ink">{orderId}</p>
      </div>

      {/* ETA cards */}
      {(hasStock || hasPre) && (
        <div className={`grid gap-3 mb-8 ${hasStock && hasPre ? "sm:grid-cols-2" : ""}`}>
          {hasStock && (
            <div className="rounded-xl border border-line bg-paper px-4 py-4">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--ok)" }}
              >
                {labels.inStockCard}
              </p>
              <p className="text-[12px] text-muted mb-0.5">{labels.inStockEta}</p>
              <p className="text-[14px] font-medium text-ink">{labels.inStockNote}</p>
            </div>
          )}

          {hasPre && (
            <div
              className="rounded-xl border px-4 py-4"
              style={{ borderColor: "var(--accent)", backgroundColor: "var(--accent-soft)" }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--accent)" }}
              >
                {labels.preOrderCard}
              </p>
              {shipment && (
                <div className="mb-1">
                  <p className="text-[12px] text-muted mb-0.5">{labels.preOrderVia}</p>
                  <p className="font-mono text-[13px] font-medium text-ink">
                    Shipment #{shipment.number} · {shipment.route}
                  </p>
                </div>
              )}
              {preEta && (
                <div>
                  <p className="text-[12px] text-muted mb-0.5">{labels.preOrderEta}</p>
                  <p className="font-mono text-[14px] font-semibold text-ink">
                    {formatDate(preEta, "mono")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* What happens next */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-ink mb-4">{labels.whatsNext}</h2>
        <ol className="space-y-0">
          {labels.steps.map((step, i) => (
            <li key={step.label} className="flex gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                  style={{ backgroundColor: "var(--bg)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
                >
                  {i + 1}
                </div>
                {i < labels.steps.length - 1 && (
                  <div className="w-px flex-1 my-1" style={{ backgroundColor: "var(--line)" }} />
                )}
              </div>
              <div className="pb-5 min-w-0">
                <p className="text-[14px] font-medium text-ink">{step.label}</p>
                <p className="text-[13px] text-muted mt-0.5">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link href="/dashboard/orders">
          <Button variant="primary" size="lg" className="w-full">
            {labels.trackOrder}
          </Button>
        </Link>
        <Link href="/" className="block">
          <Button variant="ghost" size="lg" className="w-full">
            {labels.continueShopping}
          </Button>
        </Link>
        <p className="text-center text-[12px] text-muted pt-1">{labels.whatsappHelp}</p>
      </div>
    </div>
  );
}
