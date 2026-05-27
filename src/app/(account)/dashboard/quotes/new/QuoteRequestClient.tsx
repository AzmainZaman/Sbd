"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { QuoteRequestStep2 } from "@/components/quote/QuoteRequestStep2";
import { fetchLinkPreview, type LinkPreview } from "@/actions/link-preview";
import { fetchOpenShipments, type OpenShipmentSummary } from "@/actions/shipments";
import type { QuoteFormData } from "@/components/quote/QuoteRequestForm";

const RETAILERS = ["Amazon", "eBay", "Apple", "Nike", "Adidas", "Dyson"];

const labels = {
  back: "← Back to quotes",
  headline: "What would you like to order?",
  sub: "Paste a product link from Amazon, eBay, Apple, and more",
  urlPlaceholder: "https://www.amazon.com/dp/...",
  worksWithLabel: "Works with",
  andMore: "and more",
  getQuote: "Get quote",
  foundProduct: "Found a product from",
  continueBtn: "Continue with this product →",
  tryDifferent: "Use a different URL",
  step1Label: "Step 1 of 2",
  step1Heading: "Product details",
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
  reviewBtn: "Review request →",
  requiredMark: "*",
};

type Step = "enter" | "loading" | "preview" | "form" | "review";

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function getRetailerName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    if (hostname.includes("amazon")) return "Amazon";
    if (hostname.includes("ebay")) return "eBay";
    if (hostname.includes("apple")) return "Apple";
    if (hostname.includes("nike")) return "Nike";
    if (hostname.includes("adidas")) return "Adidas";
    if (hostname.includes("dyson")) return "Dyson";
    if (hostname.includes("sephora")) return "Sephora";
    if (hostname.includes("target")) return "Target";
    if (hostname.includes("walmart")) return "Walmart";
    if (hostname.includes("bestbuy")) return "Best Buy";
    if (hostname.includes("asos")) return "ASOS";
    if (hostname.includes("zara")) return "Zara";
    const parts = hostname.split(".");
    const domain = parts.length >= 2 ? parts[parts.length - 2] : hostname;
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return "Retailer";
  }
}

const fieldClass =
  "w-full h-11 px-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors";

// ─── Sub-components ───────────────────────────────────────────────────────────

function MiniPreviewCard({ preview, url }: { preview: LinkPreview | null; url: string }) {
  const retailer = preview?.siteName ?? getRetailerName(url);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 flex items-center gap-3 mb-6">
      {preview?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt=""
          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[var(--bg)]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-[var(--ink)] truncate">
          {preview?.title ?? "Product"}
        </p>
        <p className="text-[12px] text-[var(--muted)] truncate">{retailer}</p>
      </div>
    </div>
  );
}

function EnterStep({
  url,
  onUrlChange,
  onSubmit,
  loading,
}: {
  url: string;
  onUrlChange: (v: string) => void;
  onSubmit: (url: string) => void;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").trim();
    if (isValidUrl(pasted)) {
      onUrlChange(pasted);
      // Let the paste land in the input first, then trigger
      setTimeout(() => onSubmit(pasted), 0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && isValidUrl(url)) onSubmit(url);
  }

  return (
    <div className="flex flex-col items-center text-center pt-10 pb-20 max-w-[600px] mx-auto">
      <h1 className="text-[38px] sm:text-[48px] font-semibold text-[var(--ink)] tracking-tight leading-[1.1] mb-4">
        {labels.headline}
      </h1>
      <p className="text-[16px] text-[var(--muted)] mb-10 max-w-[420px]">{labels.sub}</p>

      {/* URL input */}
      <div className="w-full relative mb-5">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={labels.urlPlaceholder}
          disabled={loading}
          className="w-full h-[56px] pl-5 pr-[130px] rounded-2xl border-2 border-[var(--line)] bg-[var(--paper)] text-[15px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors shadow-sm disabled:opacity-60"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            variant="primary"
            size="md"
            onClick={() => onSubmit(url)}
            disabled={!isValidUrl(url) || loading}
          >
            {loading ? "Loading…" : labels.getQuote}
          </Button>
        </div>
      </div>

      {/* Supported retailer chips */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-[12px] text-[var(--muted)]">{labels.worksWithLabel}</span>
        {RETAILERS.map((r) => (
          <Chip key={r} variant="line">
            {r}
          </Chip>
        ))}
        <span className="text-[12px] text-[var(--muted)]">{labels.andMore}</span>
      </div>
    </div>
  );
}

function PreviewStep({
  preview,
  url,
  onContinue,
  onReset,
}: {
  preview: LinkPreview | null;
  url: string;
  onContinue: () => void;
  onReset: () => void;
}) {
  const retailer = preview?.siteName ?? getRetailerName(url);
  const [imgError, setImgError] = useState(false);

  const faviconSrc =
    preview?.favicon ??
    `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`;

  return (
    <div className="max-w-[500px] mx-auto pt-4">
      <p className="text-[14px] text-[var(--muted)] mb-5 text-center">
        Found a product on{" "}
        <span className="font-semibold text-[var(--ink)]">{retailer}</span>
      </p>

      {/* Preview card */}
      <div
        className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] overflow-hidden shadow-sm mb-5"
      >
        {/* Product image */}
        {preview?.image && !imgError ? (
          <div className="h-[220px] bg-[var(--bg)] flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.image}
              alt=""
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div
            className="h-[100px] flex items-center justify-center"
            style={{ backgroundColor: "var(--bg)" }}
          >
            <svg
              viewBox="0 0 24 24"
              width={36}
              height={36}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--muted)" }}
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        <div className="px-5 py-4">
          {/* Site name + favicon */}
          <div className="flex items-center gap-1.5 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconSrc}
              alt=""
              width={14}
              height={14}
              className="rounded-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-[12px] text-[var(--muted)]">{retailer}</span>
          </div>

          {/* Title */}
          <h2 className="text-[16px] font-semibold text-[var(--ink)] leading-snug mb-1.5">
            {preview?.title ?? "Product"}
          </h2>

          {/* Description */}
          {preview?.description && (
            <p
              className="text-[13px] leading-relaxed"
              style={{
                color: "var(--muted)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {preview.description}
            </p>
          )}

          {/* URL */}
          <p className="text-[11px] font-mono text-[var(--muted)] mt-3 truncate">{url}</p>
        </div>
      </div>

      <Button variant="accent" size="lg" onClick={onContinue} className="w-full mb-3">
        {labels.continueBtn}
      </Button>
      <button
        type="button"
        onClick={onReset}
        className="w-full text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-1"
      >
        {labels.tryDifferent}
      </button>
    </div>
  );
}

function FormStep({
  url,
  preview,
  openShipments,
  onNext,
}: {
  url: string;
  preview: LinkPreview | null;
  openShipments: OpenShipmentSummary[];
  onNext: (data: QuoteFormData) => void;
}) {
  const [productName, setProductName] = useState(preview?.title ?? "");
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [preferredShipmentId, setPreferredShipmentId] = useState("");
  const [budgetStr, setBudgetStr] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleNext() {
    const errs: Record<string, string> = {};
    if (!productName.trim()) errs.productName = "Product name is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext({
      url,
      productName: productName.trim(),
      quantity,
      variant: variant.trim(),
      preferredShipmentId,
      budgetCeilingBDT: budgetStr ? Number(budgetStr) : undefined,
      notes: notes.trim(),
    });
  }

  return (
    <div className="max-w-[540px] mx-auto">
      <MiniPreviewCard preview={preview} url={url} />

      <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1">
        {labels.step1Label}
      </p>
      <h2 className="text-[24px] font-semibold text-[var(--ink)] mb-6">
        {labels.step1Heading}
      </h2>

      <div className="space-y-5">
        {/* Product name */}
        <div>
          <label
            htmlFor="qf-name"
            className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
          >
            {labels.productNameLabel}{" "}
            <span style={{ color: "var(--accent)" }}>{labels.requiredMark}</span>
          </label>
          <input
            id="qf-name"
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setErrors((p) => ({ ...p, productName: "" }));
            }}
            placeholder={labels.productNamePlaceholder}
            className={fieldClass}
            aria-invalid={!!errors.productName}
          />
          {errors.productName && (
            <p className="mt-1 text-[12px]" style={{ color: "var(--accent)" }}>
              {errors.productName}
            </p>
          )}
        </div>

        {/* Variant */}
        <div>
          <label
            htmlFor="qf-variant"
            className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
          >
            {labels.variantLabel}
          </label>
          <input
            id="qf-variant"
            type="text"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            placeholder={labels.variantPlaceholder}
            className={fieldClass}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-[13px] font-medium text-[var(--ink)] mb-1.5">
            {labels.quantityLabel}
          </label>
          <QuantityInput value={quantity} onChange={setQuantity} min={1} max={10} />
        </div>

        {/* Preferred shipment */}
        <div>
          <label
            htmlFor="qf-shipment"
            className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
          >
            {labels.shipmentLabel}
          </label>
          <select
            id="qf-shipment"
            value={preferredShipmentId}
            onChange={(e) => setPreferredShipmentId(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition-colors cursor-pointer"
          >
            <option value="">{labels.noPreference}</option>
            {openShipments.map((s) => (
              <option key={s.id} value={s.id}>
                {`Shipment #${s.number} · ${s.route} · Cutoff ${new Date(
                  s.cutoffDate
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  timeZone: "UTC",
                })}`}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="qf-budget"
            className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
          >
            {labels.budgetLabel}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted)] select-none">
              ৳
            </span>
            <input
              id="qf-budget"
              type="number"
              value={budgetStr}
              onChange={(e) => setBudgetStr(e.target.value)}
              placeholder={labels.budgetPlaceholder}
              min={0}
              className="w-full h-11 pl-8 pr-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="qf-notes"
            className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
          >
            {labels.notesLabel}
          </label>
          <textarea
            id="qf-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={labels.notesPlaceholder}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors resize-none"
          />
        </div>

        <Button variant="accent" size="lg" onClick={handleNext} className="w-full">
          {labels.reviewBtn}
        </Button>
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export function QuoteRequestClient({ initialUrl = "" }: { initialUrl?: string }) {
  const [step, setStep] = useState<Step>("enter");
  const [url, setUrl] = useState(initialUrl);
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [formData, setFormData] = useState<QuoteFormData | null>(null);
  const [openShipments, setOpenShipments] = useState<OpenShipmentSummary[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetchOpenShipments().then(setOpenShipments);
  }, []);

  // Auto-trigger preview when arriving with a pre-filled URL (e.g. from homepage)
  useEffect(() => {
    if (initialUrl && isValidUrl(initialUrl)) {
      handleFetchPreview(initialUrl);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFetchPreview(targetUrl: string) {
    if (!isValidUrl(targetUrl)) return;
    setUrl(targetUrl);
    setStep("loading");
    startTransition(async () => {
      const data = await fetchLinkPreview(targetUrl.trim());
      setPreview(data);
      setStep("preview");
    });
  }

  function handleReset() {
    setStep("enter");
    setPreview(null);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/quotes"
        className="inline-flex items-center text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-6"
      >
        {labels.back}
      </Link>

      {(step === "enter" || step === "loading") && (
        <EnterStep
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleFetchPreview}
          loading={step === "loading"}
        />
      )}

      {step === "preview" && (
        <PreviewStep
          preview={preview}
          url={url}
          onContinue={() => setStep("form")}
          onReset={handleReset}
        />
      )}

      {step === "form" && (
        <FormStep
          url={url}
          preview={preview}
          openShipments={openShipments}
          onNext={(data) => {
            setFormData(data);
            setStep("review");
          }}
        />
      )}

      {step === "review" && formData && (
        <div className="max-w-[540px] mx-auto">
          <QuoteRequestStep2
            data={formData}
            openShipments={openShipments}
            onBack={() => setStep("form")}
            onSuccess={() => {}}
          />
        </div>
      )}
    </div>
  );
}
