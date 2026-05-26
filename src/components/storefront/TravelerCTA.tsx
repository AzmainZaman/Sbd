import Link from "next/link";
import { Button } from "@/components/ui/Button";

const labels = {
  eyebrow: "FOR TRAVELERS",
  heading: "Earn while you travel.",
  sub: "Bring packages from the USA, UK, or Europe and earn a commission on every delivery. Flexible. Trusted. Rewarding.",
  cta: "Learn more",
  badge: "Coming soon",
};

export function TravelerCTA() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
        className="relative rounded-3xl overflow-hidden px-8 py-12 lg:px-16 lg:py-16"
        style={{ background: "var(--ink)" }}
      >
        {/* Background accent blob */}
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative max-w-[560px]">
          <span className="text-[11px] font-mono font-semibold tracking-widest text-paper/50">
            {labels.eyebrow}
          </span>
          <h2 className="mt-3 text-[32px] lg:text-[40px] font-semibold text-paper leading-tight">
            {labels.heading}
          </h2>
          <p className="mt-4 text-[15px] text-paper/70 leading-relaxed">{labels.sub}</p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/traveler">
              <Button variant="accent" size="lg">{labels.cta}</Button>
            </Link>
            <span className="text-[13px] text-paper/40">{labels.badge}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
