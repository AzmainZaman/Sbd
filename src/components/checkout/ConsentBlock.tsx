"use client";

import { Button } from "@/components/ui/Button";
import type { PaymentMethod } from "@/types/order";

const paymentNote: Partial<Record<PaymentMethod, string>> = {
  bkash: "After placing your order you'll need to send payment via bKash. Instructions appear on the next screen.",
  nagad: "After placing your order you'll need to send payment via Nagad. Instructions appear on the next screen.",
  card: "After placing your order you'll need to complete payment manually. Instructions appear on the next screen.",
};

const labels = {
  consentText:
    "I agree to the Terms & Conditions, the Pre-order Policy (custom quotes are non-refundable once shipping begins), and the Refund Policy.",
  placeOrder: "Place order",
  selectPayment: "Select a payment method to continue",
};

type ConsentBlockProps = {
  agreed: boolean;
  onAgreedChange: (v: boolean) => void;
  paymentSelected: boolean;
  paymentMethod?: PaymentMethod | null;
  onPlaceOrder: () => void;
  isPlacing?: boolean;
};

export function ConsentBlock({
  agreed,
  onAgreedChange,
  paymentSelected,
  paymentMethod,
  onPlaceOrder,
  isPlacing = false,
}: ConsentBlockProps) {
  const canPlace = agreed && paymentSelected && !isPlacing;
  const note = paymentMethod ? paymentNote[paymentMethod] : undefined;

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

      {/* Payment note for non-COD */}
      {note && (
        <p className="text-[12px] text-muted leading-relaxed px-1">{note}</p>
      )}

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
        {isPlacing ? "Placing order…" : labels.placeOrder}
      </Button>
    </div>
  );
}
