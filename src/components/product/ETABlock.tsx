import Link from "next/link";
import { ShipBar } from "@/components/ui/ShipBar";
import { formatDate } from "@/lib/utils";
import type { Shipment } from "@/types/shipment";

type ETABlockProps = {
  shipment: Shipment;
  eta: string;
};

const labels = {
  heading: "Pre-order details",
  shipment: "SHIPMENT",
  arrives: "Estimated arrival",
  cutoff: "Order cutoff",
  join: "Join this shipment",
  spotsLeft: "spots reserved so far",
};

export function ETABlock({ shipment, eta }: ETABlockProps) {
  const cutoff = new Date(shipment.cutoffDate);
  const now = new Date();
  const msLeft = cutoff.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86_400_000));

  const [origin] = shipment.route.split(" → ");

  return (
    <div className="rounded-2xl p-5 lg:p-6" style={{ background: "var(--ink)" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] text-paper/50 tracking-widest">
          {labels.shipment} #{shipment.number}
        </span>
        <span className="text-[12px] text-paper/50">{origin}</span>
      </div>

      <ShipBar progress={0} steps={7} />

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] text-paper/40">{labels.arrives}</p>
          <p className="mt-1 font-mono text-[14px] font-semibold text-paper">
            {formatDate(eta, "mono")}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-paper/40">{labels.cutoff}</p>
          <p className="mt-1 font-mono text-[14px] font-semibold text-paper">
            {formatDate(shipment.cutoffDate, "mono")}
          </p>
          {daysLeft > 0 && (
            <p className="mt-0.5 text-[11px]" style={{ color: "var(--warn)" }}>
              {daysLeft}d remaining
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-paper/10 flex items-center justify-between">
        <span className="text-[12px] text-paper/50">
          {shipment.itemCount} {labels.spotsLeft}
        </span>
        <Link
          href="/shipments"
          className="text-[12px] font-medium hover:opacity-80 transition-opacity"
          style={{ color: "var(--accent)" }}
        >
          {labels.join} →
        </Link>
      </div>
    </div>
  );
}
