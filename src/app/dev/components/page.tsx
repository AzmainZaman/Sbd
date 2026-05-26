"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon, iconNames } from "@/components/ui/Icon";
import { FlagBadge } from "@/components/ui/FlagBadge";
import { Money } from "@/components/ui/Money";
import { Star, StarRating } from "@/components/ui/Star";
import { ShipBar } from "@/components/ui/ShipBar";
import { QuantityInput } from "@/components/ui/QuantityInput";
import type { CountryCode } from "@/types/product";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-12">
    <h2 className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted)] mb-4 pb-2 border-b border-[var(--line)]">
      {title}
    </h2>
    {children}
  </section>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

export default function DevComponentsPage() {
  const [qty, setQty] = useState(1);

  const countries: CountryCode[] = ["US", "UK", "EU", "CN", "AU", "AE", "BD"];

  return (
    <main className="min-h-screen bg-[var(--bg)] px-8 py-12 max-w-5xl mx-auto">
      <header className="mb-12">
        <p className="text-[11px] font-mono text-[var(--accent)] mb-2">DEV ONLY · NOT LINKED FROM NAV</p>
        <h1 className="text-[32px] font-semibold text-[var(--ink)] tracking-tight">
          UI Primitives
        </h1>
        <p className="text-[var(--muted)] mt-1 text-[14px]">
          Phase 1B — visual test page for all atomic components.
        </p>
      </header>

      {/* ── Buttons ──────────────────────────────────────────── */}
      <Section title="Button">
        <div className="space-y-3">
          <Row>
            <Button variant="primary" size="sm">Primary sm</Button>
            <Button variant="primary" size="md">Primary md</Button>
            <Button variant="primary" size="lg">Primary lg</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </Row>
          <Row>
            <Button variant="accent" size="sm">Pre-order sm</Button>
            <Button variant="accent" size="md">Request quote</Button>
            <Button variant="accent" size="lg">Accept quote</Button>
            <Button variant="accent" disabled>Disabled</Button>
          </Row>
          <Row>
            <Button variant="ghost" size="sm">Cancel sm</Button>
            <Button variant="ghost" size="md">Continue shopping</Button>
            <Button variant="ghost" size="lg">Decline lg</Button>
            <Button variant="ghost" disabled>Disabled</Button>
          </Row>
        </div>
      </Section>

      {/* ── Chips ─────────────────────────────────────────────── */}
      <Section title="Chip">
        <Row>
          <Chip variant="stock">In stock</Chip>
          <Chip variant="pre">Pre-order · ETA 28 Jun</Chip>
          <Chip variant="accent">New quote</Chip>
          <Chip variant="line">USA</Chip>
          <Chip variant="line">UK</Chip>
          <Chip variant="dark">Shipment #14</Chip>
          <Chip variant="default">Other</Chip>
        </Row>
      </Section>

      {/* ── Icons ─────────────────────────────────────────────── */}
      <Section title={`Icon (${iconNames.length} icons)`}>
        <div className="grid grid-cols-8 gap-4 sm:grid-cols-10 lg:grid-cols-12">
          {iconNames.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[var(--line)] transition-colors"
            >
              <Icon name={name} size={20} className="text-[var(--ink)]" />
              <span className="text-[9px] text-[var(--muted)] font-mono text-center leading-tight break-all">
                {name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4 p-4 bg-[var(--ink)] rounded-xl">
          <span className="text-[11px] font-mono text-[var(--muted)] mr-2">On dark:</span>
          {(["search", "cart", "user", "menu", "chevron-down", "heart", "package", "truck"] as const).map((n) => (
            <Icon key={n} name={n} size={20} className="text-white" />
          ))}
        </div>
      </Section>

      {/* ── FlagBadge ─────────────────────────────────────────── */}
      <Section title="FlagBadge">
        <Row>
          {countries.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <FlagBadge country={c} size={24} />
              <span className="text-[13px] text-[var(--muted)] font-mono">{c}</span>
            </div>
          ))}
        </Row>
        <Row>
          {countries.map((c) => (
            <FlagBadge key={c} country={c} size={16} />
          ))}
          {countries.map((c) => (
            <FlagBadge key={c + "32"} country={c} size={32} />
          ))}
        </Row>
      </Section>

      {/* ── Money ─────────────────────────────────────────────── */}
      <Section title="Money">
        <Row>
          <Money bdt={4500} size="sm" />
          <Money bdt={18500} size="md" />
          <Money bdt={45000} size="lg" />
        </Row>
        <Row>
          <Money bdt={18500} usd={245} size="sm" showUsd />
          <Money bdt={45000} usd={599.99} size="md" showUsd />
          <Money bdt={32000} usd={279.99} size="lg" showUsd />
        </Row>
      </Section>

      {/* ── Star ──────────────────────────────────────────────── */}
      <Section title="Star">
        <div className="space-y-3">
          <Row>
            <Star state="full" />
            <Star state="half" />
            <Star state="empty" />
            <Star state="full" size={20} />
            <Star state="half" size={20} />
            <Star state="empty" size={20} />
            <Star state="full" size={24} />
          </Row>
          <Row>
            <StarRating rating={5} />
            <StarRating rating={4.5} />
            <StarRating rating={4} />
            <StarRating rating={3.5} />
            <StarRating rating={2} />
            <StarRating rating={1} />
          </Row>
          <Row>
            <StarRating rating={4.8} size={14} />
            <span className="text-[13px] text-[var(--muted)]">4.8 (312 reviews)</span>
          </Row>
        </div>
      </Section>

      {/* ── ShipBar ───────────────────────────────────────────── */}
      <Section title="ShipBar">
        <div className="space-y-4 max-w-sm">
          {[0, 25, 50, 75, 100].map((p) => (
            <div key={p} className="flex items-center gap-4">
              <span className="text-[12px] font-mono text-[var(--muted)] w-8">{p}%</span>
              <ShipBar progress={p} className="flex-1" />
            </div>
          ))}
          <div className="pt-2 border-t border-[var(--line)]">
            <p className="text-[11px] text-[var(--muted)] mb-3 font-mono">With steps (7 milestones)</p>
            {[0, 43, 86, 100].map((p) => (
              <div key={p} className="flex items-center gap-4 mb-3">
                <span className="text-[12px] font-mono text-[var(--muted)] w-8">{p}%</span>
                <ShipBar progress={p} steps={7} className="flex-1" />
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[var(--line)]">
            <p className="text-[11px] text-[var(--muted)] mb-3 font-mono">Accent variant</p>
            <ShipBar progress={60} accent steps={5} />
          </div>
        </div>
      </Section>

      {/* ── QuantityInput ─────────────────────────────────────── */}
      <Section title="QuantityInput">
        <div className="space-y-4">
          <Row>
            <QuantityInput value={qty} onChange={setQty} min={1} max={10} />
            <span className="text-[13px] text-[var(--muted)]">
              Value: <span className="font-mono">{qty}</span> / max 10
            </span>
          </Row>
          <Row>
            <QuantityInput value={1} onChange={() => {}} min={1} max={1} />
            <span className="text-[13px] text-[var(--muted)]">At min (both arrows disabled)</span>
          </Row>
          <Row>
            <QuantityInput value={5} onChange={() => {}} disabled />
            <span className="text-[13px] text-[var(--muted)]">Disabled</span>
          </Row>
        </div>
      </Section>

      {/* ── Combined Card ─────────────────────────────────────── */}
      <Section title="Combined — product card preview">
        <div className="w-72 bg-[var(--paper)] rounded-2xl border border-[var(--line)] p-4 space-y-3">
          <div
            className="h-40 rounded-xl"
            style={{ background: "linear-gradient(135deg, #f5e6d3 0%, #e8d5c0 40%, #d4b896 100%)" }}
          />
          <div className="flex items-center gap-2">
            <FlagBadge country="US" size={16} />
            <Chip variant="stock">In stock</Chip>
            <Chip variant="line">Dyson</Chip>
          </div>
          <p className="text-[14px] font-medium text-[var(--ink)] leading-snug">
            Dyson Airwrap Complete Styler
          </p>
          <div className="flex items-center gap-2">
            <StarRating rating={4.8} size={13} />
            <span className="text-[12px] text-[var(--muted)]">4.8 (312)</span>
          </div>
          <div className="flex items-center justify-between">
            <Money bdt={45000} usd={599.99} size="md" showUsd />
            <Button variant="primary" size="sm">Add to cart</Button>
          </div>
        </div>
        <div className="w-72 bg-[var(--paper)] rounded-2xl border border-[var(--line)] p-4 space-y-3 mt-4">
          <div
            className="h-40 rounded-xl"
            style={{ background: "linear-gradient(135deg, #4a4a4a 0%, #2c2c2c 50%, #1a1a1a 100%)" }}
          />
          <div className="flex items-center gap-2">
            <FlagBadge country="US" size={16} />
            <Chip variant="pre">Pre-order · ETA 28 Jun</Chip>
          </div>
          <p className="text-[14px] font-medium text-[var(--ink)] leading-snug">
            Shark FlexStyle Air Styling System
          </p>
          <div className="flex items-center gap-2">
            <Chip variant="dark">Shipment #14</Chip>
            <Icon name="clock" size={14} className="text-[var(--muted)]" />
            <span className="text-[12px] text-[var(--muted)] font-mono">7d 4h left</span>
          </div>
          <div className="flex items-center justify-between">
            <Money bdt={32000} usd={279.99} size="md" showUsd />
            <Button variant="accent" size="sm">Pre-order</Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
