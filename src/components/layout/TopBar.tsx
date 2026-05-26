"use client";

import { useState, useEffect } from "react";
import { getNextCutoff, formatCountdown } from "@/lib/shipment-utils";
import { Icon } from "@/components/ui/Icon";

const labels = {
  trustAuthentic: "100% Authentic",
  trustPricing: "Transparent pricing",
  trustSupport: "WhatsApp support",
  fallback: "Pre-order from USA & UK — delivered to Bangladesh",
};

export function TopBar() {
  const [countdownText, setCountdownText] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const next = getNextCutoff();
      if (next) {
        setCountdownText(formatCountdown(next.msUntilCutoff));
        setRoute(next.shipment.route);
      }
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
        {/* Left: countdown or fallback */}
        <p className="text-[12px] leading-none">
          {countdownText && route ? (
            <>
              Next cutoff{" "}
              <span className="font-mono font-semibold">{countdownText}</span>
              {" · "}
              <span className="opacity-80">{route}</span>
            </>
          ) : (
            <span className="opacity-80">{labels.fallback}</span>
          )}
        </p>

        {/* Right: trust signals */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] opacity-70 shrink-0">
          <span className="flex items-center gap-1">
            <Icon name="check-circle" size={12} />
            {labels.trustAuthentic}
          </span>
          <span className="opacity-40">·</span>
          <span>{labels.trustPricing}</span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <Icon name="chat" size={12} />
            {labels.trustSupport}
          </span>
        </div>
      </div>
    </div>
  );
}
