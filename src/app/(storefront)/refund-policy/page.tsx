import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refund Policy — SBD Global Shopping",
  description: "Our returns and refund policy for in-stock and pre-order purchases.",
};

const sections = [
  {
    heading: "1. In-stock orders",
    body: "In-stock items can be returned within 7 days of delivery if the item is unused, in its original packaging, and accompanied by proof of purchase. Contact us to arrange a return — we will inspect the item and issue a refund within 5 business days of receipt.",
  },
  {
    heading: "2. Pre-orders (custom quotes)",
    body: "Pre-order payments are non-refundable once we have purchased the item from the international retailer. If you cancel within 24 hours of order placement and the item has not yet been purchased, a full refund will be issued within 3–5 business days. See our Pre-order Policy for full details.",
  },
  {
    heading: "3. Damaged or incorrect items",
    body: "If your order arrives damaged, defective, or differs from what was ordered, contact us within 48 hours with photographs. We will send a replacement or issue a full refund — your choice. Return shipping is covered by us in this case.",
  },
  {
    heading: "4. Non-returnable items",
    body: "The following items cannot be returned: opened cosmetics and skincare products, consumables (supplements, food), digital goods, and items marked as non-returnable on their product page.",
  },
  {
    heading: "5. Refund timeline",
    body: "Approved refunds are processed within 5 business days to your original payment method (bKash, Nagad, or bank transfer). Card refunds may take 7–10 business days depending on your bank.",
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-[36px] sm:text-[44px] font-semibold text-ink tracking-tight mb-4">
        Returns &amp; Refund Policy
      </h1>
      <p className="font-mono text-[13px] text-muted mb-10">Last updated: 27 MAY 2026</p>

      <div className="space-y-8">
        {sections.map(({ heading, body }) => (
          <div key={heading}>
            <h2 className="text-[18px] font-semibold text-ink mb-2">{heading}</h2>
            <p className="text-[15px] text-muted leading-relaxed">{body}</p>
          </div>
        ))}

        <div>
          <h2 className="text-[18px] font-semibold text-ink mb-2">6. Contact</h2>
          <p className="text-[15px] text-muted leading-relaxed">
            To initiate a return or refund, email{" "}
            <a href="mailto:team@shob.ai" className="text-ink underline hover:opacity-70 transition-opacity">
              team@shob.ai
            </a>{" "}
            with your order ID and a description of the issue.
          </p>
        </div>
      </div>
    </div>
  );
}
