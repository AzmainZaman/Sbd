import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SBD Global Shopping",
  description:
    "Learn about SBD Global Shopping — your trusted bridge for authentic products from the USA, UK, and beyond to Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-[36px] sm:text-[44px] font-semibold text-ink tracking-tight mb-4">
        About SBD Global Shopping
      </h1>
      <p className="text-[16px] text-muted leading-relaxed mb-8">
        SBD Global Shopping is Bangladesh&apos;s trusted pre-order platform for authentic
        international products. We source directly from authorised retailers in the USA
        and UK so you can shop confidently — no counterfeits, no hidden markups.
      </p>

      <h2 className="text-[22px] font-semibold text-ink mb-3">Our mission</h2>
      <p className="text-[15px] text-muted leading-relaxed mb-8">
        We believe everyone in Bangladesh deserves access to the world&apos;s best products at
        fair, transparent prices. Our team handles every step — sourcing, quality checks,
        customs clearance, and last-mile delivery — so you don&apos;t have to.
      </p>

      <h2 id="how-it-works" className="text-[22px] font-semibold text-ink mb-3">How it works</h2>
      <ol className="space-y-4 mb-8">
        {[
          { step: "1", text: "Browse or request a quote for any product available abroad." },
          { step: "2", text: "We confirm pricing including duties and delivery fees — no surprises." },
          { step: "3", text: "Your item joins the next outbound shipment from the USA or UK." },
          { step: "4", text: "We clear customs and deliver to your door in Dhaka." },
        ].map(({ step, text }) => (
          <li key={step} className="flex items-start gap-4">
            <span
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-paper bg-ink"
            >
              {step}
            </span>
            <p className="text-[15px] text-muted leading-relaxed pt-1">{text}</p>
          </li>
        ))}
      </ol>

      <h2 className="text-[22px] font-semibold text-ink mb-3">Authenticity guarantee</h2>
      <p className="text-[15px] text-muted leading-relaxed mb-8">
        Every item is purchased from a verified international retailer with a receipt.
        We share purchase proof on request. If an item arrives damaged or counterfeit,
        we make it right — full replacement or refund.
      </p>

      <h2 className="text-[22px] font-semibold text-ink mb-3">Contact us</h2>
      <p className="text-[15px] text-muted leading-relaxed">
        Questions? Reach us on{" "}
        <a
          href="https://wa.me/8801711000000"
          className="text-ink underline hover:opacity-70 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>{" "}
        or email{" "}
        <a
          href="mailto:team@shob.ai"
          className="text-ink underline hover:opacity-70 transition-opacity"
        >
          team@shob.ai
        </a>
        .
      </p>
    </div>
  );
}
