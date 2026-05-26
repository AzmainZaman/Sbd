"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { shipments } from "@/data/shipments";

const labels = {
  stepLabel: "Step 1 of 2",
  heading: "Request a quote",
  subheading: "Tell us what you want and we'll price it up within 24 hours.",
  urlLabel: "Product URL",
  urlPlaceholder: "https://www.amazon.com/dp/...",
  productNameLabel: "Product name",
  productNamePlaceholder: "e.g. Dyson Airwrap Complete Long",
  variantLabel: "Variant / colour / size",
  variantPlaceholder: "e.g. Prussian Blue, 32GB, Size M (optional)",
  quantityLabel: "Quantity",
  shipmentLabel: "Preferred shipment",
  noPreference: "No preference",
  budgetLabel: "Budget ceiling (BDT)",
  budgetPlaceholder: "Optional — e.g. 25000",
  notesLabel: "Notes",
  notesPlaceholder: "Any special requirements, colour preference, etc. (optional)",
  next: "Review request →",
  requiredMark: "*",
  requiredLegend: "Required fields",
};

export type QuoteFormData = {
  url: string;
  productName: string;
  quantity: number;
  variant: string;
  preferredShipmentId: string;
  budgetCeilingBDT?: number;
  notes: string;
};

type QuoteRequestFormProps = {
  initialUrl?: string;
  onNext: (data: QuoteFormData) => void;
};

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

export function QuoteRequestForm({ initialUrl = "", onNext }: QuoteRequestFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [productName, setProductName] = useState("");
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [preferredShipmentId, setPreferredShipmentId] = useState("");
  const [budgetStr, setBudgetStr] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openShipments = shipments.filter((s) => s.status === "accepting");

  function validate() {
    const errs: Record<string, string> = {};
    if (!url.trim()) {
      errs.url = "Product URL is required";
    } else {
      try {
        new URL(url);
      } catch {
        errs.url = "Please enter a valid URL";
      }
    }
    if (!productName.trim()) errs.productName = "Product name is required";
    return errs;
  }

  function handleNext() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext({
      url: url.trim(),
      productName: productName.trim(),
      quantity,
      variant: variant.trim(),
      preferredShipmentId,
      budgetCeilingBDT: budgetStr ? Number(budgetStr) : undefined,
      notes: notes.trim(),
    });
  }

  return (
    <div className="max-w-140">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">
        {labels.stepLabel}
      </p>
      <h2 className="text-[24px] font-semibold text-ink mb-1">{labels.heading}</h2>
      <p className="text-[14px] text-muted mb-7">{labels.subheading}</p>

      <p className="text-[11px] text-muted mb-5">
        <span style={{ color: "var(--accent)" }}>{labels.requiredMark}</span>{" "}
        {labels.requiredLegend}
      </p>

      <div className="space-y-5">
        {/* URL */}
        <div>
          <label htmlFor="quote-url" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.urlLabel}{" "}
            <span style={{ color: "var(--accent)" }}>{labels.requiredMark}</span>
          </label>
          <input
            id="quote-url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setErrors((p) => ({ ...p, url: "" }));
            }}
            placeholder={labels.urlPlaceholder}
            className={inputClass}
            aria-describedby={errors.url ? "quote-url-error" : undefined}
            aria-invalid={!!errors.url}
          />
          {errors.url && (
            <p id="quote-url-error" className="mt-1 text-[12px]" style={{ color: "var(--accent)" }}>
              {errors.url}
            </p>
          )}
        </div>

        {/* Product name */}
        <div>
          <label htmlFor="quote-product-name" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.productNameLabel}{" "}
            <span style={{ color: "var(--accent)" }}>{labels.requiredMark}</span>
          </label>
          <input
            id="quote-product-name"
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setErrors((p) => ({ ...p, productName: "" }));
            }}
            placeholder={labels.productNamePlaceholder}
            className={inputClass}
            aria-describedby={errors.productName ? "quote-product-name-error" : undefined}
            aria-invalid={!!errors.productName}
          />
          {errors.productName && (
            <p id="quote-product-name-error" className="mt-1 text-[12px]" style={{ color: "var(--accent)" }}>
              {errors.productName}
            </p>
          )}
        </div>

        {/* Variant */}
        <div>
          <label htmlFor="quote-variant" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.variantLabel}
          </label>
          <input
            id="quote-variant"
            type="text"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            placeholder={labels.variantPlaceholder}
            className={inputClass}
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quote-quantity" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.quantityLabel}
          </label>
          <QuantityInput value={quantity} onChange={setQuantity} min={1} max={10} />
        </div>

        {/* Preferred shipment */}
        <div>
          <label htmlFor="quote-shipment" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.shipmentLabel}
          </label>
          <select
            id="quote-shipment"
            value={preferredShipmentId}
            onChange={(e) => setPreferredShipmentId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-line bg-paper text-[14px] text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
          >
            <option value="">{labels.noPreference}</option>
            {openShipments.map((s) => (
              <option key={s.id} value={s.id}>
                {`Shipment #${s.number} · ${s.route} · Cutoff ${new Date(s.cutoffDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`}
              </option>
            ))}
          </select>
        </div>

        {/* Budget ceiling */}
        <div>
          <label htmlFor="quote-budget" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.budgetLabel}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-muted select-none">
              ৳
            </span>
            <input
              id="quote-budget"
              type="number"
              value={budgetStr}
              onChange={(e) => setBudgetStr(e.target.value)}
              placeholder={labels.budgetPlaceholder}
              min={0}
              className="w-full h-10 pl-7 pr-3 rounded-xl border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="quote-notes" className="block text-[13px] font-medium text-ink mb-1.5">
            {labels.notesLabel}
          </label>
          <textarea
            id="quote-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={labels.notesPlaceholder}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors resize-none"
          />
        </div>

        <Button variant="accent" size="lg" onClick={handleNext} className="w-full">
          {labels.next}
        </Button>
      </div>
    </div>
  );
}
