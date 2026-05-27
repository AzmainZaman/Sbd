const steps = [
  {
    number: "01",
    title: "Browse or request",
    body: "Find products in our catalog or paste any product URL from Amazon, Nike, Sephora, and more to request a custom quote.",
  },
  {
    number: "02",
    title: "We source & verify",
    body: "Our team buys from authorised retailers, verifies authenticity, and photographs each item before it ships.",
  },
  {
    number: "03",
    title: "Packed into shipments",
    body: "Your order joins our regular consolidated shipment — we handle customs, duties, and last-mile delivery.",
  },
  {
    number: "04",
    title: "Delivered to your door",
    body: "Receive your items in Dhaka within the ETA shown on your pre-order. Track every step in your dashboard.",
  },
];

const labels = {
  heading: "How SBD works",
  sub: "From browsing to your doorstep in four simple steps.",
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-paper border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-[28px] lg:text-[36px] font-semibold text-ink">{labels.heading}</h2>
          <p className="mt-3 text-[16px] text-muted">{labels.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="font-mono text-[40px] font-semibold leading-none" style={{ color: "var(--line)" }}>
                {step.number}
              </span>
              <h3 className="mt-3 text-[16px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14px] text-muted leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
