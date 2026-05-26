import Link from "next/link";
import { shipments } from "@/data/shipments";
import { formatDate } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const labels = {
  heading: "Next shipment",
  cutoffLabel: "Order cutoff",
  itemsLabel: "Items booked",
  cta: "View all shipments",
};

export function NextShipmentCard() {
  const accepting = shipments
    .filter((s) => s.status === "accepting")
    .sort(
      (a, b) =>
        new Date(a.cutoffDate).getTime() - new Date(b.cutoffDate).getTime()
    );

  if (accepting.length === 0) return null;

  const next = accepting[0];

  return (
    <div
      className="rounded-xl border px-4 py-4"
      style={{
        borderColor: "var(--accent)",
        backgroundColor: "var(--accent-soft)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--accent)" }}
          >
            {labels.heading}
          </p>
          <p className="font-mono text-[14px] font-semibold text-ink">
            Shipment #{next.number} · {next.route}
          </p>
          <div className="flex items-center gap-5 mt-2">
            <div>
              <p className="text-[11px] text-muted">{labels.cutoffLabel}</p>
              <p className="font-mono text-[13px] font-medium text-ink">
                {formatDate(next.cutoffDate, "mono")}
              </p>
            </div>
            {next.itemCount > 0 && (
              <div>
                <p className="text-[11px] text-muted">{labels.itemsLabel}</p>
                <p className="font-mono text-[13px] font-medium text-ink">
                  {next.itemCount}
                </p>
              </div>
            )}
          </div>
          {next.customerNote && (
            <p
              className="text-[12px] mt-2 leading-relaxed"
              style={{ color: "var(--accent)" }}
            >
              {next.customerNote}
            </p>
          )}
        </div>
        <Icon
          name="package"
          size={20}
          className="shrink-0 mt-0.5"
          style={{ color: "var(--accent)" }}
        />
      </div>
      <Link
        href="/shipments"
        className="inline-flex items-center gap-1 text-[12px] font-medium mt-3"
        style={{ color: "var(--accent)" }}
      >
        {labels.cta}
        <Icon name="chevron-right" size={13} strokeWidth={2} />
      </Link>
    </div>
  );
}
