import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FlagBadge } from "@/components/ui/FlagBadge";

const labels = {
  headline: "Shop global brands.",
  headlineAccent: "Delivered to Bangladesh.",
  sub: "Pre-order from the USA, UK, Europe, and more — authentic products at transparent prices, shipped directly to your door.",
  cta1: "Shop now",
  cta2: "Request a quote",
  howItWorks: "How it works ↓",
  sourcedFrom: "Sourced from",
  trust1: "100% Authentic",
  trust2: "Transparent pricing",
  trust3: "WhatsApp support",
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <h1 className="text-[40px] sm:text-[52px] lg:text-[60px] font-semibold tracking-tight leading-[1.1] text-ink">
              {labels.headline}
              <br />
              <span style={{ color: "var(--accent)" }}>{labels.headlineAccent}</span>
            </h1>
            <p className="mt-5 text-[16px] lg:text-[18px] leading-relaxed text-muted max-w-[480px]">
              {labels.sub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="primary" size="lg">{labels.cta1}</Button>
              </Link>
              <Link href="/dashboard/quotes/new">
                <Button variant="accent" size="lg">{labels.cta2}</Button>
              </Link>
            </div>
            <div className="mt-3">
              <Link
                href="#how-it-works"
                className="text-[13px] text-muted hover:text-ink transition-colors"
              >
                {labels.howItWorks}
              </Link>
            </div>

            {/* Source countries */}
            <div className="mt-10 flex items-center gap-3 flex-wrap">
              <span className="text-[13px] text-muted">{labels.sourcedFrom}</span>
              {(["US", "UK", "EU", "CN", "AU", "AE"] as const).map((c) => (
                <FlagBadge key={c} country={c} size={20} />
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {[labels.trust1, labels.trust2, labels.trust3].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[13px] text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-ok flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — product cards mosaic */}
          <div className="relative hidden lg:block h-[480px]">
            <div
              className="absolute top-0 right-0 w-[220px] h-[280px] rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #f5e6d3 0%, #d4b896 100%)" }}
            />
            <div
              className="absolute top-16 right-[200px] w-[200px] h-[260px] rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f48fb1 100%)" }}
            />
            <div
              className="absolute top-36 right-[80px] w-[180px] h-[240px] rounded-2xl shadow-md"
              style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bdbdbd 100%)" }}
            />
            {/* Floating price badge */}
            <div className="absolute bottom-24 right-4 bg-paper rounded-xl px-3 py-2 shadow-lg border border-line">
              <p className="text-[11px] text-muted">Dyson Airwrap</p>
              <p className="text-[15px] font-semibold text-ink">৳45,000</p>
            </div>
            {/* Floating ETA badge */}
            <div className="absolute top-8 right-[160px] bg-ink rounded-xl px-3 py-2 shadow-lg">
              <p className="text-[11px] text-paper/70 font-mono">SHIPMENT #14</p>
              <p className="text-[13px] font-medium text-paper">Arriving 28 Jun</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
