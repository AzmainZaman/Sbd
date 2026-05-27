"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { formatDate } from "@/lib/utils";
import { formatCountdown } from "@/lib/shipment-utils";
import type { Product } from "@/types/product";
import type { ShipmentSummary } from "./page";

type Props = {
  products: Product[];
  shipments: ShipmentSummary[];
};

const steps = [
  {
    num: "01",
    title: "Choose your items",
    body: "Browse pre-order products and add them to your cart. Items ship together in one batch.",
  },
  {
    num: "02",
    title: "Place your order before cutoff",
    body: "Each shipment has a cutoff date. Orders placed before the cutoff join that shipment.",
  },
  {
    num: "03",
    title: "We source & ship",
    body: "We purchase from the origin retailer, consolidate in our warehouse, and ship to Bangladesh.",
  },
  {
    num: "04",
    title: "Delivered to your door",
    body: "Your items arrive on the landing date shown. We notify you at every step via WhatsApp.",
  },
];

const labels = {
  heading: "Pre-orders",
  subtitle: "Reserve international products now — we source them for you and deliver to Bangladesh.",
  openShipments: "Open shipments",
  shipment: "SHIPMENT",
  cutoffLabel: "Order by",
  arrivingLabel: "Arriving",
  joinLink: "Join shipment →",
  productsHeading: "Available to pre-order",
  emptyHeading: "No pre-orders open right now",
  emptyBody: "Check back soon — new shipments open regularly. You can also request a custom quote for any international product.",
  quoteCta: "Request a custom quote",
  howHeading: "How pre-orders work",
};

function ShipmentCard({ shipment }: { shipment: ShipmentSummary }) {
  const [countdown, setCountdown] = useState<string | null>(null);
  const ref = useRef(shipment.cutoffDate);

  useEffect(() => {
    ref.current = shipment.cutoffDate;
    const update = () => {
      const ms = new Date(ref.current).getTime() - Date.now();
      setCountdown(ms > 0 ? formatCountdown(ms) : null);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [shipment.cutoffDate]);

  const [origin] = shipment.route.split(" → ");

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[var(--muted)]">
            {labels.shipment} #{shipment.number}
          </span>
          <p className="mt-1 text-[15px] font-semibold text-[var(--ink)]">
            From {origin}
          </p>
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[var(--muted)]">{labels.cutoffLabel}</span>
              <span className="font-mono font-medium text-[var(--warn)]">
                {formatDate(shipment.cutoffDate, "short")}
              </span>
              {countdown && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="text-[var(--muted)]">{countdown} left</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[var(--muted)]">{labels.arrivingLabel}</span>
              <span className="font-mono font-medium text-[var(--ink)]">
                {formatDate(shipment.landingDate, "short")}
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/shipments"
          className="shrink-0 text-[13px] font-medium whitespace-nowrap transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          {labels.joinLink}
        </Link>
      </div>
    </div>
  );
}

export function PreOrdersClient({ products, shipments }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] lg:text-[36px] font-semibold text-[var(--ink)]">
          {labels.heading}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--muted)] max-w-[560px]">
          {labels.subtitle}
        </p>
      </div>

      {/* Open shipments */}
      {shipments.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-[var(--ink)] mb-3">
            {labels.openShipments}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shipments.map((s) => (
              <ShipmentCard key={s.id} shipment={s} />
            ))}
          </div>
        </section>
      )}

      {/* Product grid */}
      {products.length > 0 ? (
        <section className="mb-16">
          <h2 className="text-[20px] font-semibold text-[var(--ink)] mb-5">
            {labels.productsHeading}
            <span className="ml-2 text-[16px] font-normal text-[var(--muted)]">
              ({products.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-16 py-20 text-center border border-[var(--line)] rounded-2xl bg-[var(--paper)]">
          <div className="text-[40px] mb-4">📦</div>
          <h2 className="text-[20px] font-semibold text-[var(--ink)]">{labels.emptyHeading}</h2>
          <p className="mt-2 text-[14px] text-[var(--muted)] max-w-[400px] mx-auto">
            {labels.emptyBody}
          </p>
          <Link
            href="/dashboard/quotes/new"
            className="inline-block mt-6 px-5 py-2.5 rounded-xl text-[14px] font-medium text-[var(--paper)] transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {labels.quoteCta}
          </Link>
        </section>
      )}

      {/* How pre-orders work */}
      <section className="border-t border-[var(--line)] pt-12">
        <h2 className="text-[22px] font-semibold text-[var(--ink)] mb-8">
          {labels.howHeading}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num}>
              <span className="text-[13px] font-mono text-[var(--muted)]">{s.num}</span>
              <h3 className="mt-2 text-[15px] font-semibold text-[var(--ink)]">{s.title}</h3>
              <p className="mt-1 text-[13px] text-[var(--muted)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
