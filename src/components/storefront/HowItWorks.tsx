const steps = [
  {
    number: "01",
    title: "Browse or request",
    body: "Find products in our catalog or paste any product URL from Amazon, Nike, Sephora, and more to request a custom quote.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "We source & verify",
    body: "Our team buys from authorised retailers, verifies authenticity, and photographs each item before it ships.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Packed into shipments",
    body: "Your order joins our regular consolidated shipment — we handle customs, duties, and last-mile delivery.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Delivered to your door",
    body: "Receive your items in Dhaka within the ETA shown on your pre-order. Track every step in your dashboard.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const labels = {
  heading: "How SBD works",
  sub: "From browsing to your doorstep in four simple steps.",
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-[28px] lg:text-[36px] font-semibold text-ink">{labels.heading}</h2>
          <p className="mt-3 text-[16px] text-muted">{labels.sub}</p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-7 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px pointer-events-none"
            style={{ background: "var(--line)" }}
          />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col gap-4 rounded-2xl p-6 bg-paper border border-line shadow-sm"
            >
              {/* Number badge */}
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[13px] font-bold px-2.5 py-1 rounded-lg leading-none"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div style={{ color: "var(--accent)" }}>{step.icon}</div>

              {/* Text */}
              <div>
                <h3 className="text-[16px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-[14px] text-muted leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
