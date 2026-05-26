import { formatDate } from "@/lib/utils";
import { shipments } from "@/data/shipments";

const labels = {
  heading: "Pre-order shipment",
  via: "via",
  eta: "ETA",
  cutoff: "Cutoff",
  noShipment: "Your pre-order items will be assigned to the next available shipment.",
};

type ShipmentNoteProps = {
  /** Shipment ID from the pre-order cart item, e.g. "14" */
  shipmentId?: string;
  /** ISO date of the earliest pre-order ETA */
  eta?: string;
};

export function ShipmentNote({ shipmentId, eta }: ShipmentNoteProps) {
  const shipment = shipmentId ? shipments.find((s) => s.id === shipmentId) : null;

  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{ borderColor: "var(--accent)", backgroundColor: "var(--accent-soft)" }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--accent)" }}
      >
        {labels.heading}
      </p>

      {shipment ? (
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <div>
            <p className="text-[11px] text-muted mb-0.5">{labels.via}</p>
            <p className="font-mono text-[13px] font-medium text-ink">
              Shipment #{shipment.number} · {shipment.route}
            </p>
          </div>
          {(eta ?? shipment.landingDate) && (
            <div>
              <p className="text-[11px] text-muted mb-0.5">{labels.eta}</p>
              <p className="font-mono text-[13px] font-medium text-ink">
                {formatDate(eta ?? shipment.landingDate, "mono")}
              </p>
            </div>
          )}
          <div>
            <p className="text-[11px] text-muted mb-0.5">{labels.cutoff}</p>
            <p className="font-mono text-[13px] font-medium text-ink">
              {formatDate(shipment.cutoffDate, "mono")}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[13px] text-muted">{labels.noShipment}</p>
      )}
    </div>
  );
}
