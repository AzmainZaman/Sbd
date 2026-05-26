"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { formatBDT } from "@/lib/utils";
import { createQuote } from "@/actions/quotes";
import type { QuoteFormData } from "./QuoteRequestForm";
import type { OpenShipmentSummary } from "@/actions/shipments";

const labels = {
  stepLabel: "Step 2 of 2",
  heading: "Review your request",
  urlLabel: "Product URL",
  productLabel: "Product",
  variantLabel: "Variant",
  quantityLabel: "Quantity",
  shipmentLabel: "Preferred shipment",
  budgetLabel: "Budget ceiling",
  notesLabel: "Notes",
  none: "—",
  noPreference: "No preference",
  back: "← Back",
  submit: "Submit request",
  submitting: "Submitting…",
  successHeading: "Request submitted!",
  successDesc:
    "We'll review your request and send a price quote within 24 hours. You'll be notified via WhatsApp and email.",
  successRefLabel: "Your reference ID:",
  awaitingReview: "Awaiting review",
  requestAnother: "Request another quote",
};

type SuccessState = {
  quoteId: string;
};

type QuoteRequestStep2Props = {
  data: QuoteFormData;
  openShipments: OpenShipmentSummary[];
  onBack: () => void;
  onSuccess: (quoteId: string) => void;
};

export function QuoteRequestStep2({ data, openShipments, onBack, onSuccess }: QuoteRequestStep2Props) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const shipment = data.preferredShipmentId
    ? openShipments.find((s) => s.id === data.preferredShipmentId)
    : null;

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { quoteId } = await createQuote({
        sourceUrl: data.url,
        productName: data.productName,
        productVariant: data.variant || undefined,
        quantity: data.quantity,
        notes: data.notes || undefined,
        preferredShipmentId: data.preferredShipmentId || undefined,
        budgetCeilingBDT: data.budgetCeilingBDT,
      });
      setSuccess({ quoteId });
      onSuccess(quoteId);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-140">
        <div className="rounded-2xl border border-line bg-paper p-8 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <svg
              viewBox="0 0 24 24"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--accent)" }}
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-[20px] font-semibold text-ink mb-2">{labels.successHeading}</h3>
          <p className="text-[14px] text-muted mb-5">{labels.successDesc}</p>
          <div className="rounded-xl px-4 py-3 mb-5 inline-block bg-bg">
            <p className="text-[11px] font-medium text-muted uppercase tracking-widest mb-1">
              {labels.successRefLabel}
            </p>
            <p className="font-mono text-[15px] font-semibold text-ink">{success.quoteId}</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Chip variant="pre">{labels.awaitingReview}</Chip>
            <Link
              href="/search"
              className="text-[13px] text-muted hover:text-ink transition-colors underline underline-offset-2"
            >
              {labels.requestAnother}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rows: { label: string; value: string; mono?: boolean; isUrl?: boolean }[] = [
    { label: labels.urlLabel, value: data.url, isUrl: true },
    { label: labels.productLabel, value: data.productName },
    { label: labels.variantLabel, value: data.variant || labels.none },
    { label: labels.quantityLabel, value: String(data.quantity) },
    {
      label: labels.shipmentLabel,
      value: shipment
        ? `Shipment #${shipment.number} · ${shipment.route}`
        : labels.noPreference,
    },
    {
      label: labels.budgetLabel,
      value: data.budgetCeilingBDT ? formatBDT(data.budgetCeilingBDT) : labels.none,
      mono: !!data.budgetCeilingBDT,
    },
    { label: labels.notesLabel, value: data.notes || labels.none },
  ];

  return (
    <div className="max-w-140">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">
        {labels.stepLabel}
      </p>
      <h2 className="text-[24px] font-semibold text-ink mb-6">{labels.heading}</h2>

      <div className="rounded-2xl border border-line bg-paper overflow-hidden mb-6 divide-y divide-line">
        {rows.map(({ label, value, mono, isUrl }) => (
          <div key={label} className="flex gap-4 px-4 py-3">
            <span className="text-[13px] w-37 shrink-0 text-muted">{label}</span>
            {isUrl ? (
              <span className="font-mono text-[12px] break-all leading-relaxed text-ink">
                {value}
              </span>
            ) : (
              <span className={`text-[13px] wrap-break-word text-ink ${mono ? "font-mono" : ""}`}>
                {value}
              </span>
            )}
          </div>
        ))}
      </div>

      {submitError && (
        <p className="text-[13px] mb-3" style={{ color: "var(--accent)" }}>
          {submitError}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="flex-1">
          {labels.back}
        </Button>
        <Button
          variant="accent"
          size="lg"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1"
        >
          {submitting ? labels.submitting : labels.submit}
        </Button>
      </div>
    </div>
  );
}
