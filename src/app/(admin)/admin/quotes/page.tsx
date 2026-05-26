"use client";

import { useState } from "react";
import { quotes as allQuotes } from "@/data/quotes";
import { shipments } from "@/data/shipments";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatDate, formatBDT } from "@/lib/utils";
import type { Quote, QuoteStatus } from "@/types/quote";
import type { ComponentProps } from "react";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const statusChip: Record<QuoteStatus, { label: string; variant: ChipVariant }> =
  {
    pending: { label: "Pending", variant: "default" },
    "quote-sent": { label: "Sent", variant: "accent" },
    "customer-replied": { label: "Replied", variant: "line" },
    accepted: { label: "Accepted", variant: "stock" },
    declined: { label: "Declined", variant: "line" },
    expired: { label: "Expired", variant: "default" },
  };

const sortOrder: Record<QuoteStatus, number> = {
  pending: 0,
  "customer-replied": 1,
  "quote-sent": 2,
  accepted: 3,
  declined: 4,
  expired: 5,
};

const labels = {
  heading: "Quotes inbox",
  noSelection: "Select a quote to view details",
  noSelectionSub: "Pending quotes need a price to be sent.",
  customerLabel: "Customer",
  phoneLabel: "Phone",
  productLabel: "Product",
  retailerLabel: "Retailer",
  urlLabel: "Source URL",
  notesLabel: "Notes",
  budgetLabel: "Budget ceiling",
  shipmentLabel: "Shipment preference",
  composeHeading: "Send a quote",
  itemPriceLabel: "Item price (৳)",
  dutyLabel: "Duty (৳)",
  shippingLabel: "Inbound shipping (৳)",
  handlingLabel: "Handling (৳)",
  totalLabel: "Total",
  shipmentAssignLabel: "Assign shipment",
  etaLabel: "ETA (ISO date, e.g. 2026-06-28)",
  adminNoteLabel: "Note for customer (optional)",
  sendQuote: "Send quote",
  quoteAlreadySent: "Quote sent",
  sentDetails: "Sent quote details",
  expiry: "Expires",
};

type ComposeState = {
  itemPrice: string;
  duty: string;
  shipping: string;
  handling: string;
  shipmentId: string;
  eta: string;
  adminNote: string;
};

const defaultCompose: ComposeState = {
  itemPrice: "",
  duty: "",
  shipping: "1200",
  handling: "500",
  shipmentId: "",
  eta: "",
  adminNote: "",
};

function calcTotal(c: ComposeState): number {
  return (
    (Number(c.itemPrice) || 0) +
    (Number(c.duty) || 0) +
    (Number(c.shipping) || 0) +
    (Number(c.handling) || 0)
  );
}

function InboxRow({
  quote,
  selected,
  onClick,
}: {
  quote: Quote;
  selected: boolean;
  onClick: () => void;
}) {
  const chip = statusChip[quote.status];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-line transition-colors cursor-pointer ${
        selected ? "bg-paper" : "bg-transparent hover:bg-paper/60"
      }`}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <Chip variant={chip.variant}>{chip.label}</Chip>
        <span className="font-mono text-[11px] text-muted">{quote.id}</span>
      </div>
      <p className="text-[13px] font-medium text-ink truncate">
        {quote.productName}
      </p>
      <p className="text-[11px] text-muted mt-0.5">
        {quote.customerName} · {formatDate(quote.requestedAt, "short")}
      </p>
    </button>
  );
}

function DetailPane({ quote }: { quote: Quote }) {
  const [compose, setCompose] = useState<ComposeState>({
    ...defaultCompose,
    shipmentId: quote.preferredShipmentId ?? "",
    eta: quote.eta ?? "",
    itemPrice: quote.itemPriceBDT?.toString() ?? "",
    duty: quote.dutyBDT?.toString() ?? "",
    shipping: quote.inboundShippingBDT?.toString() ?? "1200",
    handling: quote.handlingBDT?.toString() ?? "500",
    adminNote: quote.adminNote ?? "",
  });
  const [sent, setSent] = useState(quote.status === "quote-sent");

  const total = calcTotal(compose);
  const acceptingShipments = shipments.filter((s) => s.status === "accepting");

  function set(field: keyof ComposeState, val: string) {
    setCompose((prev) => ({ ...prev, [field]: val }));
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Quote request details */}
      <div className="px-6 py-5 border-b border-line">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-mono text-[13px] text-muted">{quote.id}</p>
            <h2 className="text-[17px] font-semibold text-ink mt-0.5">
              {quote.productName}
            </h2>
            {quote.productVariant && (
              <p className="text-[13px] text-muted">{quote.productVariant}</p>
            )}
          </div>
          <Chip variant={statusChip[quote.status].variant}>
            {statusChip[quote.status].label}
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
          <div>
            <span className="text-muted">{labels.customerLabel}: </span>
            <span className="text-ink font-medium">{quote.customerName}</span>
          </div>
          <div>
            <span className="text-muted">{labels.phoneLabel}: </span>
            <span className="font-mono text-ink">{quote.customerPhone}</span>
          </div>
          <div>
            <span className="text-muted">{labels.retailerLabel}: </span>
            <span className="text-ink">{quote.sourceRetailer}</span>
          </div>
          <div>
            <span className="text-muted">Qty: </span>
            <span className="text-ink font-medium">{quote.quantity}</span>
          </div>
        </div>

        {quote.sourceUrl && (
          <div className="mt-2">
            <span className="text-[12px] text-muted">{labels.urlLabel}: </span>
            <span className="text-[12px] text-ink break-all">
              {quote.sourceUrl}
            </span>
          </div>
        )}

        {quote.notes && (
          <div className="mt-2 bg-bg rounded-lg px-3 py-2">
            <p className="text-[12px] text-muted mb-0.5">{labels.notesLabel}</p>
            <p className="text-[13px] text-ink">{quote.notes}</p>
          </div>
        )}

        {quote.budgetCeilingBDT != null && (
          <p className="text-[12px] text-muted mt-2">
            {labels.budgetLabel}:{" "}
            <span className="text-ink font-medium">
              {formatBDT(quote.budgetCeilingBDT)}
            </span>
          </p>
        )}
      </div>

      {/* Compose or read-only details */}
      <div className="px-6 py-5 flex-1">
        {quote.status === "pending" && !sent ? (
          <>
            <h3 className="text-[14px] font-semibold text-ink mb-4">
              {labels.composeHeading}
            </h3>

            <div className="space-y-3">
              {/* Assign shipment */}
              <div>
                <label className="block text-[12px] font-medium text-muted mb-1">
                  {labels.shipmentAssignLabel}
                </label>
                <select
                  value={compose.shipmentId}
                  onChange={(e) => set("shipmentId", e.target.value)}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-ink"
                >
                  <option value="">— Select shipment —</option>
                  {acceptingShipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.number} · {s.route} · cutoff{" "}
                      {formatDate(s.cutoffDate, "short")}
                    </option>
                  ))}
                </select>
              </div>

              {/* ETA */}
              <div>
                <label className="block text-[12px] font-medium text-muted mb-1">
                  {labels.etaLabel}
                </label>
                <input
                  type="text"
                  placeholder="2026-06-28"
                  value={compose.eta}
                  onChange={(e) => set("eta", e.target.value)}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-ink font-mono"
                />
              </div>

              {/* Pricing grid */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["itemPrice", labels.itemPriceLabel],
                    ["duty", labels.dutyLabel],
                    ["shipping", labels.shippingLabel],
                    ["handling", labels.handlingLabel],
                  ] as [keyof ComposeState, string][]
                ).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-[12px] font-medium text-muted mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={compose[field]}
                      onChange={(e) => set(field, e.target.value)}
                      className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-ink"
                    />
                  </div>
                ))}
              </div>

              {/* Auto-total */}
              <div className="flex items-center justify-between rounded-lg bg-bg px-4 py-3">
                <span className="text-[13px] font-medium text-muted">
                  {labels.totalLabel}
                </span>
                <span className="font-mono text-[15px] font-semibold text-ink">
                  {formatBDT(total)}
                </span>
              </div>

              {/* Admin note */}
              <div>
                <label className="block text-[12px] font-medium text-muted mb-1">
                  {labels.adminNoteLabel}
                </label>
                <textarea
                  rows={2}
                  value={compose.adminNote}
                  onChange={(e) => set("adminNote", e.target.value)}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-ink resize-none"
                  placeholder="Authentic product sourced from official retailer…"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={!compose.itemPrice || !compose.shipmentId || !compose.eta}
                onClick={() => setSent(true)}
              >
                {labels.sendQuote}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Sent / read-only view */}
            <h3 className="text-[14px] font-semibold text-ink mb-4">
              {sent && quote.status === "pending"
                ? labels.quoteAlreadySent
                : labels.sentDetails}
            </h3>

            {sent && quote.status === "pending" && (
              <div
                className="rounded-xl border px-4 py-3 mb-4"
                style={{
                  borderColor: "var(--ok)",
                  backgroundColor: "#e8f5ee",
                }}
              >
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "var(--ok)" }}
                >
                  Quote sent to {quote.customerName}. (Phase 1 mock — no email
                  sent.)
                </p>
              </div>
            )}

            <div className="space-y-2 text-[13px]">
              {[
                [
                  "Item price",
                  quote.itemPriceBDT != null
                    ? formatBDT(
                        sent
                          ? Number(compose.itemPrice) || quote.itemPriceBDT
                          : quote.itemPriceBDT
                      )
                    : "—",
                ],
                [
                  "Duty",
                  quote.dutyBDT != null
                    ? formatBDT(
                        sent
                          ? Number(compose.duty) || quote.dutyBDT
                          : quote.dutyBDT
                      )
                    : "—",
                ],
                [
                  "Inbound shipping",
                  quote.inboundShippingBDT != null
                    ? formatBDT(
                        sent
                          ? Number(compose.shipping) || quote.inboundShippingBDT
                          : quote.inboundShippingBDT
                      )
                    : "—",
                ],
                [
                  "Handling",
                  quote.handlingBDT != null
                    ? formatBDT(
                        sent
                          ? Number(compose.handling) || quote.handlingBDT
                          : quote.handlingBDT
                      )
                    : "—",
                ],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted">{key}</span>
                  <span className="font-mono text-ink">{val}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-line pt-2 font-semibold">
                <span className="text-ink">Total</span>
                <span className="font-mono text-ink">
                  {quote.totalBDT != null
                    ? formatBDT(sent ? total || quote.totalBDT : quote.totalBDT)
                    : "—"}
                </span>
              </div>
            </div>

            {(compose.eta || quote.eta) && (
              <p className="text-[12px] text-muted mt-3">
                ETA:{" "}
                <span className="font-mono text-ink">
                  {formatDate(compose.eta || quote.eta!, "mono")}
                </span>
              </p>
            )}

            {(compose.adminNote || quote.adminNote) && (
              <div className="mt-3 bg-bg rounded-lg px-3 py-2">
                <p className="text-[12px] text-muted mb-0.5">Note to customer</p>
                <p className="text-[13px] text-ink">
                  {compose.adminNote || quote.adminNote}
                </p>
              </div>
            )}

            {quote.expiresAt && (
              <p className="text-[12px] text-muted mt-3">
                {labels.expiry} {formatDate(quote.expiresAt, "short")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminQuotesPage() {
  const sorted = [...allQuotes].sort(
    (a, b) => sortOrder[a.status] - sortOrder[b.status]
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    sorted[0]?.id ?? null
  );
  const selected = sorted.find((q) => q.id === selectedId) ?? null;

  return (
    <div className="flex h-full" style={{ minHeight: "calc(100vh - 0px)" }}>
      {/* Inbox list */}
      <div className="w-72 shrink-0 border-r border-line bg-bg overflow-auto">
        <div className="px-4 py-4 border-b border-line">
          <h1 className="text-[16px] font-semibold text-ink">
            {labels.heading}
          </h1>
          <p className="text-[12px] text-muted mt-0.5">
            {sorted.length} quotes
          </p>
        </div>
        {sorted.map((q) => (
          <InboxRow
            key={q.id}
            quote={q}
            selected={selectedId === q.id}
            onClick={() => setSelectedId(q.id)}
          />
        ))}
      </div>

      {/* Detail / compose pane */}
      <div className="flex-1 min-w-0 bg-paper overflow-auto">
        {selected ? (
          <DetailPane key={selected.id} quote={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Icon
              name="tag"
              size={32}
              className="text-muted mb-3"
              strokeWidth={1}
            />
            <p className="text-[15px] font-medium text-ink">
              {labels.noSelection}
            </p>
            <p className="text-[13px] text-muted mt-1">{labels.noSelectionSub}</p>
          </div>
        )}
      </div>
    </div>
  );
}
