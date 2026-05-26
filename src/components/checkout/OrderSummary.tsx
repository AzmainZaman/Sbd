import { formatBDT } from "@/lib/utils";

const labels = {
  heading: "Order summary",
  subtotal: "Subtotal",
  inboundShipping: "Inbound shipping",
  importDuty: "Import duty",
  dutyNote: "estimated",
  handling: "Handling fee",
  localDelivery: "Local delivery",
  total: "Total",
};

const INBOUND_SHIPPING_BDT = 1200;
const HANDLING_BDT = 500;
const LOCAL_DELIVERY_BDT = 60;
const DUTY_RATE = 0.08;

type OrderSummaryProps = {
  subtotalBDT: number;
  itemCount: number;
};

export function OrderSummary({ subtotalBDT, itemCount }: OrderSummaryProps) {
  const dutyBDT = Math.round(subtotalBDT * DUTY_RATE);
  const localDeliveryBDT = subtotalBDT >= 5000 ? 0 : LOCAL_DELIVERY_BDT;
  const totalBDT = subtotalBDT + INBOUND_SHIPPING_BDT + dutyBDT + HANDLING_BDT + localDeliveryBDT;

  const fees = [
    { label: labels.subtotal, value: formatBDT(subtotalBDT), note: `${itemCount} item${itemCount !== 1 ? "s" : ""}` },
    { label: labels.inboundShipping, value: formatBDT(INBOUND_SHIPPING_BDT) },
    { label: labels.importDuty, value: formatBDT(dutyBDT), note: labels.dutyNote },
    { label: labels.handling, value: formatBDT(HANDLING_BDT) },
    { label: labels.localDelivery, value: localDeliveryBDT === 0 ? "Free" : formatBDT(localDeliveryBDT) },
  ];

  return (
    <div className="rounded-2xl border border-line bg-paper overflow-hidden">
      <div className="px-5 pt-4 pb-2 border-b border-line">
        <h2 className="text-[15px] font-semibold text-ink">{labels.heading}</h2>
      </div>

      <div className="px-5 py-3 space-y-2.5">
        {fees.map(({ label, value, note }) => (
          <div key={label} className="flex justify-between items-baseline gap-2">
            <span className="text-[13px] text-muted">
              {label}
              {note && (
                <span className="ml-1.5 text-[11px] text-muted opacity-70">({note})</span>
              )}
            </span>
            <span className="font-mono text-[13px] text-ink shrink-0">{value}</span>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-line bg-bg">
        <div className="flex justify-between items-center">
          <span className="text-[15px] font-semibold text-ink">{labels.total}</span>
          <span className="font-mono text-[18px] font-semibold text-ink">{formatBDT(totalBDT)}</span>
        </div>
      </div>
    </div>
  );
}
