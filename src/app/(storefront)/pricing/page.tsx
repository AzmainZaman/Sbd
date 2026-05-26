import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Duties — SBD Global Shopping",
  description: "How SBD Global Shopping prices products — service fee, import duties, and delivery charges explained.",
};

const sections = [
  {
    heading: "Product price",
    body: "The product price is what we pay the international retailer, converted to Bangladeshi Taka (BDT) at the prevailing exchange rate on the day of purchase. For popular items with a set retail price, the BDT amount is fixed at order time and does not fluctuate.",
  },
  {
    heading: "Service fee",
    body: "Our service fee covers sourcing, quality inspection, international shipping to Bangladesh, warehousing, and logistics coordination. The fee is calculated as a percentage of the product price and is always displayed before you confirm your order.",
  },
  {
    heading: "Import duties & taxes",
    body: "Bangladesh imposes import duties on goods brought from abroad. The duty rate depends on the product category (e.g. cosmetics, electronics, apparel). We calculate the estimated duty based on the declared value and show it as a separate line item. Actual duties assessed at customs may vary slightly; we absorb minor differences.",
  },
  {
    heading: "Delivery fee",
    body: "Local delivery within Dhaka is included for orders above a threshold. Delivery to other districts carries a flat fee shown at checkout. Express delivery is not available for pre-orders.",
  },
  {
    heading: "No hidden fees",
    body: "The total shown at checkout is what you pay. We do not add charges after delivery. If customs assess a duty significantly higher than estimated, we contact you before paying it.",
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-[36px] sm:text-[44px] font-semibold text-ink tracking-tight mb-4">
        Pricing &amp; Duties
      </h1>
      <p className="text-[16px] text-muted leading-relaxed mb-10">
        We believe in transparent pricing. Every fee is itemised at checkout — you will
        never see a surprise charge after you place your order.
      </p>

      <div className="space-y-8">
        {sections.map(({ heading, body }) => (
          <div key={heading}>
            <h2 className="text-[18px] font-semibold text-ink mb-2">{heading}</h2>
            <p className="text-[15px] text-muted leading-relaxed">{body}</p>
          </div>
        ))}

        <div>
          <h2 className="text-[18px] font-semibold text-ink mb-2">Questions?</h2>
          <p className="text-[15px] text-muted leading-relaxed">
            If you have questions about a specific product&apos;s pricing, use the{" "}
            <a href="/search" className="text-ink underline hover:opacity-70 transition-opacity">
              Request a Quote
            </a>{" "}
            feature — we&apos;ll send you a full breakdown before you commit to anything.
          </p>
        </div>
      </div>
    </div>
  );
}
