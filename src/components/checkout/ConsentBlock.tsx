"use client";

import { Button } from "@/components/ui/Button";

const labels = {
  consentText:
    "I agree to the Terms & Conditions, the Pre-order Policy (custom quotes are non-refundable once shipping begins), and the Refund Policy.",
  termsLink: "Terms & Conditions",
  policyLink: "Pre-order Policy",
  refundLink: "Refund Policy",
  placeOrder: "Place order",
  selectPayment: "Select a payment method to continue",
};

type ConsentBlockProps = {
  agreed: boolean;
  onAgreedChange: (v: boolean) => void;
  paymentSelected: boolean;
  onPlaceOrder: () => void;
};

export function ConsentBlock({
  agreed,
  onAgreedChange,
  paymentSelected,
  onPlaceOrder,
}: ConsentBlockProps) {
  const canPlace = agreed && paymentSelected;

  return (
    <div className="space-y-4">
      {/* T&C checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => onAgreedChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
            style={{
              borderColor: agreed ? "var(--ink)" : "var(--line)",
              backgroundColor: agreed ? "var(--ink)" : "transparent",
            }}
            aria-hidden="true"
          >
            {agreed && (
              <svg viewBox="0 0 12 12" width={10} height={10} fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3 5 9 2 6" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-[12px] text-muted leading-relaxed group-hover:text-ink transition-colors">
          {labels.consentText}
        </p>
      </label>

      {/* CTA */}
      {!paymentSelected && (
        <p className="text-[12px] text-muted text-center">{labels.selectPayment}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        disabled={!canPlace}
        onClick={onPlaceOrder}
        className="w-full"
      >
        {labels.placeOrder}
      </Button>
    </div>
  );
}
