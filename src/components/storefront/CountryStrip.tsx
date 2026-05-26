import { FlagBadge } from "@/components/ui/FlagBadge";
import type { CountryCode } from "@/types/product";

const countries: { code: CountryCode; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "UK", label: "United Kingdom" },
  { code: "EU", label: "Europe" },
  { code: "CN", label: "China" },
  { code: "AU", label: "Australia" },
  { code: "AE", label: "UAE" },
];

const labels = {
  heading: "We source from",
};

export function CountryStrip() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
          <span className="text-[13px] text-muted whitespace-nowrap flex-shrink-0">
            {labels.heading}
          </span>
          <div className="flex items-center gap-3 flex-shrink-0">
            {countries.map(({ code, label }) => (
              <div
                key={code}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-bg whitespace-nowrap"
              >
                <FlagBadge country={code} size={16} />
                <span className="text-[13px] font-medium text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
