"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const labels = {
  heading: "Stay in the loop",
  sub: "Get notified when new shipments open, limited-stock products arrive, and exclusive pre-order deals go live.",
  placeholder: "your@email.com",
  cta: "Subscribe",
  success: "You're in! We'll notify you when the next shipment opens.",
  disclaimer: "No spam. Unsubscribe anytime.",
};

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-paper border-t border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="max-w-[560px] mx-auto text-center">
          <h2 className="text-[28px] lg:text-[32px] font-semibold text-ink">{labels.heading}</h2>
          <p className="mt-3 text-[15px] text-muted">{labels.sub}</p>

          {submitted ? (
            <div className="mt-8 rounded-xl bg-[var(--accent-soft)] border border-[#f5cfc6] px-6 py-4">
              <p className="text-[14px] font-medium" style={{ color: "var(--accent)" }}>
                {labels.success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex gap-2 max-w-[420px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.placeholder}
                required
                className="flex-1 h-11 px-4 text-[14px] rounded-xl border border-line bg-bg text-ink placeholder-muted outline-none focus:border-ink transition-colors"
              />
              <Button variant="primary" size="md" type="submit">
                {labels.cta}
              </Button>
            </form>
          )}

          <p className="mt-4 text-[12px] text-muted">{labels.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
