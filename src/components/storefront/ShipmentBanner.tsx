"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { fetchNextCutoff } from "@/actions/shipments";
import { formatCountdown } from "@/lib/shipment-utils";

const labels = {
  shipment: "SHIPMENT",
  cutoffIn: "Cutoff in",
  cta: "Join this shipment →",
  from: "from",
};

type BannerData = {
  route: string;
  cutoffDate: string;
  landingDate: string;
  number: number;
};

export function ShipmentBanner() {
  const [data, setData] = useState<BannerData | null>(null);
  const [countdown, setCountdown] = useState<string | null>(null);
  const cutoffRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchNextCutoff().then((next) => {
      if (!mounted || !next) return;
      setData(next);
      cutoffRef.current = next.cutoffDate;
      const ms = new Date(next.cutoffDate).getTime() - Date.now();
      if (ms > 0) setCountdown(formatCountdown(ms));
    });

    const id = setInterval(() => {
      if (!cutoffRef.current) return;
      const ms = new Date(cutoffRef.current).getTime() - Date.now();
      setCountdown(ms > 0 ? formatCountdown(ms) : null);
    }, 60_000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!data) return null;

  const [origin] = data.route.split(" → ");
  const etaDate = new Date(data.landingDate);
  const etaStr = etaDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section style={{ background: "var(--ink)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-[12px] text-paper/50">
              {labels.shipment} #{data.number}
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
