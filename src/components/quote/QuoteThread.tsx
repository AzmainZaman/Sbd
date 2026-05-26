"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { formatBDT, formatDate } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { acceptQuote, declineQuote } from "@/actions/quotes";
import type { Quote, QuoteStatus } from "@/types/quote";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const labels = {
  sourceLabel: "Source URL",
  quantityLabel: "Qty",
  shipmentLabel: "Shipment",
  etaLabel: "ETA",
  itemPriceLabel: "Item price",
  dutyLabel: "Import duty",
  shippingLabel: "Inbound shipping",
  handlingLabel: "Handling",
  totalLabel: "Total",
  expiresLabel: "Offer expires",
  adminNoteLabel: "Note from SBD",
  accept: "Accept quote",
  decline: "Decline",
  /** Shown immediately after clicking Accept in this session */
  acceptedJustNowMsg: "Quote accepted — item added to your cart.",
  /** Shown when the quote was already accepted before this session */
  acceptedPreviouslyMsg: "This quote was accepted.",
  declinedMsg: "You declined this quote.",
  pendingMsg:
    "Your request is being reviewed. We'll send a quote within 24 hours via WhatsApp and email.",
  expiredMsg: "This quote has expired. Request a new quote to get an updated price.",
  statusPending: "Pending review",
  statusSent: "Quote ready",
  statusAccepted: "Accepted",
  statusDeclined: "Declined",
  statusExpired: "Expired",
  statusReplied: "Quote ready",
};

const statusChipVariant: Record<QuoteStatus, ChipVariant> = {
  pending: "line",
  "quote-sent": "pre",
  "customer-replied": "pre",
  accepted: "stock",
  declined: "default",
  expired: "default",
};

const statusLabel: Record<QuoteStatus, string> = {
  pending: labels.statusPending,
  "quote-sent": labels.statusSent,
  "customer-replied": labels.statusReplied,
  accepted: labels.statusAccepted,
  declined: labels.statusDeclined,
  expired: labels.statusExpired,
};

type QuoteThreadProps = {
  quote: Quote;
  onAccepted?: () => void;
  onDeclined?: () => void;
};

export function QuoteThread({ quote, onAccepted, onDeclined }: QuoteThreadProps) {
  const { addItem, openCart } = useCart();
  const [localStatus, setLocalStatus] = useState<QuoteStatus>(quote.status);
  const [justAccepted, setJustAccepted] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const hasBreakdown =
    quote.itemPriceBDT !== undefined &&
    quote.dutyBDT !== undefined &&
    quote.inboundShippingBDT !== undefined &&
    quote.handlingBDT !== undefined &&
    quote.totalBDT !== undefined;

  async function handleAccept() {
    setActionError(null);
    try {
      const result = await acceptQuote(quote.id);
      addItem({
        productId: `quote-${quote.id}`,
        productName: result.productName,
        variant: result.productVariant,
        priceBDT: result.totalBDT,
        quantity: result.quantity,
        type: "pre-order",
        shipmentId: result.shipmentId,
        eta: result.eta,
        hero: "linear-gradient(135deg, #e8e4dc 0%, #c8c0b0 100%)",
      });
      setLocalStatus("accepted");
      setJustAccepted(true);
      openCart();
      onAccepted?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  async function handleDecline() {
    setActionError(null);
    try {
      await declineQuote(quote.id);
      setLocalStatus("declined");
      onDeclined?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
        <div className="min-w-0">
          <p className="font-mono text-[11px] mb-0.5 text-muted">{quote.id}</p>
          <p className="text-[15px] font-semibold leading-snug text-ink">{quote.productName}</p>
          {quote.productVariant && (
            <p className="text-[13px] mt-0.5 text-muted">{quote.productVariant}</p>
          )}
        </div>
        <Chip variant={statusChipVariant[localStatus]} className="shrink-0 mt-0.5">
          {statusLabel[localStatus]}
        </Chip>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Source URL */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 text-muted">
            {labels.sourceLabel}
          </p>
          <p className="font-mono text-[12px] break-all leading-relaxed text-ink">
            {quote.sourceUrl}
          </p>
        </div>

        {/* Meta row: qty / shipment / ETA */}
        <div className="flex gap-6 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 text-muted">
              {labels.quantityLabel}
            </p>
            <p className="text-[14px] font-medium text-ink">{quote.quantity}</p>
          </div>
          {quote.shipmentId && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 text-muted">
                {labels.shipmentLabel}
              </p>
              <p className="font-mono text-[14px] font-medium text-ink">#{quote.shipmentId}</p>
            </div>
          )}
          {quote.eta && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 text-muted">
                {labels.etaLabel}
              </p>
              <p className="font-mono text-[14px] font-medium text-ink">
                {formatDate(quote.eta, "mono")}
              </p>
            </div>
          )}
        </div>

        {/* Price breakdown */}
        {hasBreakdown && (
          <div className="rounded-xl border border-line divide-y divide-line overflow-hidden">
            {[
              { label: labels.itemPriceLabel, value: formatBDT(quote.itemPriceBDT!) },
              { label: labels.dutyLabel, value: formatBDT(quote.dutyBDT!) },
              { label: labels.shippingLabel, value: formatBDT(quote.inboundShippingBDT!) },
              { label: labels.handlingLabel, value: formatBDT(quote.handlingBDT!) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-4 py-2.5 text-[13px]">
                <span className="text-muted">{label}</span>
                <span className="font-mono text-ink">{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-bg">
              <span className="text-[15px] font-semibold text-ink">{labels.totalLabel}</span>
              <span className="font-mono text-[15px] font-semibold text-ink">
                {formatBDT(quote.totalBDT!)}
              </span>
            </div>
          </div>
        )}

        {/* Expiry warning — only while quote is still actionable */}
        {quote.expiresAt && localStatus === "quote-sent" && (
          <p className="text-[12px] text-warn">
            {labels.expiresLabel}: {formatDate(quote.expiresAt, "short")}
          </p>
        )}

        {/* Admin note */}
        {quote.adminNote && (
          <div className="rounded-xl border border-line bg-bg px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 text-muted">
              {labels.adminNoteLabel}
            </p>
            <p className="text-[13px] text-ink">{quote.adminNote}</p>
          </div>
        )}

        {/* Status messages */}
        {localStatus === "pending" && (
          <p className="text-[13px] text-muted">{labels.pendingMsg}</p>
        )}
        {localStatus === "accepted" && (
          <p className="text-[13px] font-medium text-ok">
            {justAccepted ? labels.acceptedJustNowMsg : labels.acceptedPreviouslyMsg}
          </p>
        )}
        {localStatus === "declined" && (
          <p className="text-[13px] text-muted">{labels.declinedMsg}</p>
        )}
        {localStatus === "expired" && (
          <p className="text-[13px] text-muted">{labels.expiredMsg}</p>
        )}

        {actionError && (
          <p className="text-[12px]" style={{ color: "var(--accent)" }}>
            {actionError}
          </p>
        )}

        {/* CTAs — only while quote is actionable */}
        {localStatus === "quote-sent" && (
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" size="md" onClick={handleDecline} className="flex-1">
              {labels.decline}
            </Button>
            <Button variant="accent" size="md" onClick={handleAccept} className="flex-1">
              {labels.accept}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
