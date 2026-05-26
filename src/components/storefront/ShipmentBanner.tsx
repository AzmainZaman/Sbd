"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getNextCutoff, formatCountdown } from "@/lib/shipment-utils";

const labels = {
  shipment: "SHIPMENT",
  cutoffIn: "Cutoff in",
  cta: "Join this shipment →",
  from: "from",
};

export function ShipmentBanner() {
  const [countdown, setCountdown] = useState<string | null>(null);

  // Static shipment info — derived synchronously from mock data, no SSR risk
  const nextCutoff = getNextCutoff();

  useEffect(() => {
    const update = () => {
      const r = getNextCutoff();
      if (r) setCountdown(formatCountdown(r.msUntilCutoff));
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!nextCutoff) return null;

  const { shipment } = nextCutoff;
  const [origin] = shipment.route.split(" → ");
  const etaDate = new Date(shipment.landingDate);
  const etaStr = etaDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section style={{ background: "var(--ink)" }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-[12px] text-paper/50">
              {labels.shipment} #{shipment.number}
            </span>
            <span className="text-[14px] font-medium text-paper">
              {labels.from} {origin} · Arriving {etaStr}
            </span>
            {countdown && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[13px] text-paper/70">
                  {labels.cutoffIn}{" "}
                  <span className="font-mono font-semibold text-paper">{countdown}</span>
                </span>
              </span>
            )}
          </div>
          <Link
            href="/shipments"
            className="text-[13px] font-medium whitespace-nowrap hover:opacity-80 transition-opacity"
            style={{ color: "var(--accent)" }}
          >
            {labels.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
