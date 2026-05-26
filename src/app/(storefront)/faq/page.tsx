import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — SBD Global Shopping",
  description: "Frequently asked questions about pre-ordering, shipping, payments, and returns.",
};

const faqs = [
  {
    q: "What is a pre-order?",
    a: "A pre-order lets you reserve a product before it arrives in Bangladesh. We purchase it on your behalf from a verified international retailer, ship it with the next scheduled delivery, and hand it to you at the door.",
  },
  {
    q: "How long does delivery take?",
    a: "Typical turnaround is 4–8 weeks from order placement, depending on which shipment your item joins. You can see exact cutoff and estimated arrival dates on our Shipment Schedule page.",
  },
  {
    q: "Are all products authentic?",
    a: "Yes. Every item is purchased from a verified international retailer (Amazon, Sephora, John Lewis, etc.) with a purchase receipt. We share proof on request and offer a full replacement or refund if anything arrives counterfeit or damaged.",
  },
  {
    q: "What are the payment options?",
    a: "We accept bKash, Nagad, bank transfer, and cash on delivery (COD) for in-stock items. Pre-orders require payment before the shipment cutoff. Full gateway integration (bKash/Nagad redirect flow) is coming soon.",
  },
  {
    q: "Are duties and taxes included?",
    a: "No. Import duties and taxes are always shown as a separate line item at checkout so you know exactly what you're paying. We never hide fees inside the product price.",
  },
  {
    q: "Can I cancel a pre-order?",
    a: "You can cancel before we purchase the item (usually within 24 hours of order placement). Once purchased, cancellations are not accepted — the product is non-refundable after shipping begins. See our Pre-order Policy for full details.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund. All parcels are insured during transit.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Once your order is shipped, use the Track an Order page with your order ID and email address to see real-time milestone updates.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-[36px] sm:text-[44px] font-semibold text-ink tracking-tight mb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-[16px] text-muted leading-relaxed mb-10">
        Can&apos;t find your answer here?{" "}
        <a href="/contact" className="text-ink underline hover:opacity-70 transition-opacity">
          Contact us
        </a>{" "}
        and we&apos;ll reply within 2 hours.
      </p>

      <div className="divide-y divide-line">
        {faqs.map(({ q, a }) => (
          <div key={q} className="py-6">
            <h2 className="text-[16px] font-semibold text-ink mb-2">{q}</h2>
            <p className="text-[14px] text-muted leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
