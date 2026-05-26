import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-order Policy — SBD Global Shopping",
  description: "Read our pre-order policy — what you're agreeing to when you place a custom quote order.",
};

const sections = [
  {
    heading: "1. What is a pre-order?",
    body: "A pre-order is a commitment to purchase a product that is not yet in Bangladesh. When you place a pre-order, SBD Global Shopping purchases the item on your behalf from a verified international retailer and ships it on the next scheduled delivery.",
  },
  {
    heading: "2. Payment",
    body: "Full payment is required before the shipment cutoff date. Orders not paid by the cutoff will be automatically cancelled and the slot released to another customer. We do not hold items without payment.",
  },
  {
    heading: "3. Cancellations",
    body: "You may cancel a pre-order within 24 hours of placing it, provided we have not yet purchased the item from the retailer. Once purchased, your order is non-cancellable and the payment is non-refundable. We will notify you by email when your item has been purchased.",
  },
  {
    heading: "4. Delivery timelines",
    body: "Estimated arrival dates are based on the shipment schedule at the time of ordering. Delays caused by customs, weather, or carrier issues do not entitle you to a refund. We will keep you updated on any material delays via email.",
  },
  {
    heading: "5. Pricing and duties",
    body: "The quoted price includes the product cost, our service fee, and estimated import duties. Duties are always shown as a separate line item — we never hide fees in the product price. If actual duties differ significantly at customs, we will contact you before proceeding.",
  },
  {
    heading: "6. Damaged or missing items",
    body: "If your item arrives damaged or differs from what was ordered, contact us within 48 hours of delivery with photographs. We will arrange a replacement or full refund at our discretion. All shipments are insured during transit.",
  },
];

export default function PreOrderPolicyPage() {
  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-[36px] sm:text-[44px] font-semibold text-ink tracking-tight mb-4">
        Pre-order Policy
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
          <h2 className="text-[18px] font-semibold text-ink mb-2">7. Contact</h2>
          <p className="text-[15px] text-muted leading-relaxed">
            Questions about this policy? Email{" "}
            <a href="mailto:team@shob.ai" className="text-ink underline hover:opacity-70 transition-opacity">
              team@shob.ai
            </a>{" "}
            or reach us on{" "}
            <a
              href="https://wa.me/8801711000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline hover:opacity-70 transition-opacity"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
