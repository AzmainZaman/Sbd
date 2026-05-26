import { getAllShipmentsAdmin } from "@/actions/admin/shipments";
import { formatDate, formatBDT } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import type { ShipmentStatus } from "@/types/shipment";
import type { ComponentProps } from "react";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const statusChip: Record<ShipmentStatus, { label: string; variant: ChipVariant }> = {
  accepting: { label: "Accepting", variant: "accent" },
  cutoff: { label: "Cutoff", variant: "default" },
  outbound: { label: "Outbound", variant: "dark" },
  "in-transit": { label: "In transit", variant: "dark" },
  customs: { label: "Customs", variant: "default" },
  delivery: { label: "Delivery", variant: "stock" },
  delivered: { label: "Delivered", variant: "stock" },
};

const labels = {
  heading: "Shipments",
  sub: "All USA and UK inbound shipments.",
  cutoffLabel: "Cutoff",
  liftoffLabel: "Liftoff",
  landingLabel: "Landing (DAC)",
  itemsLabel: "Items",
  valueLabel: "Value",
  statusLabel: "Status",
  milestonesHeading: "Milestones",
  noteLabel: "Note",
};

export default async function AdminShipmentsPage() {
  const shipments = await getAllShipmentsAdmin();

  const sorted = [...shipments].sort((a, b) => {
    if (a.status === "accepting" && b.status !== "accepting") return -1;
    if (b.status === "accepting" && a.status !== "accepting") return 1;
    return new Date(b.cutoffDate).getTime() - new Date(a.cutoffDate).getTime();
  });

  return (
    <div className="px-6 py-8">
      <h1 className="text-[20px] font-semibold text-ink mb-1">{labels.heading}</h1>
      <p className="text-[13px] text-muted mb-6">{labels.sub}</p>

      <div className="space-y-4">
        {sorted.map((shipment) => {
          const chip = statusChip[shipment.status];
          const doneMilestones = shipment.milestones.filter((m) => m.completedAt);
          const totalMilestones = shipment.milestones.length;
          const progressPct =
            totalMilestones > 0
              ? Math.round((doneMilestones.length / totalMilestones) * 100)
              : 0;

          return (
            <div
              key={shipment.id}
              className="rounded-xl border border-line bg-paper px-5 py-5"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-[15px] font-semibold text-ink">
                      Shipment #{shipment.number}
                    </p>
                    <Chip variant={chip.variant}>{chip.label}</Chip>
                  </div>
                  <p className="text-[13px] text-muted">{shipment.route}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] text-muted">{labels.itemsLabel}</p>
                  <p className="font-mono text-[15px] font-semibold text-ink">
                    {shipment.itemCount}
                  </p>
                </div>
              </div>

              {/* Date row */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {(
                  [
                    [labels.cutoffLabel, shipment.cutoffDate],
                    [labels.liftoffLabel, shipment.liftoffDate],
                    [labels.landingLabel, shipment.landingDate],
                  ] as [string, string][]
                ).map(([lbl, date]) => (
                  <div key={lbl}>
                    <p className="text-[11px] text-muted font-medium uppercase tracking-widest">
                      {lbl}
                    </p>
                    <p className="font-mono text-[13px] font-medium text-ink mt-0.5">
                      {formatDate(date, "mono")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-muted mb-1">
                  <span>{labels.milestonesHeading}</span>
                  <span>
                    {doneMilestones.length}/{totalMilestones}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progressPct}%`,
                      backgroundColor:
                        progressPct === 100 ? "var(--ok)" : "var(--ink)",
                    }}
                  />
                </div>
              </div>

              {/* Milestone dots */}
              <div className="flex gap-2 flex-wrap">
                {shipment.milestones.map((m) => (
                  <div key={m.label} className="flex items-center gap-1.5 text-[11px]">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: m.completedAt ? "var(--ok)" : "var(--line)",
                      }}
                    />
                    <span
                      style={{
                        color: m.completedAt ? "var(--ok)" : "var(--muted)",
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Value + note */}
              {(shipment.totalValueBDT > 0 || shipment.customerNote) && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                  {shipment.totalValueBDT > 0 && (
                    <p className="text-[12px] text-muted">
                      {labels.valueLabel}:{" "}
                      <span className="font-mono text-ink">
                        {formatBDT(shipment.totalValueBDT)}
                      </span>
                    </p>
                  )}
                  {shipment.customerNote && (
                    <p className="text-[12px] text-muted italic">{shipment.customerNote}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
