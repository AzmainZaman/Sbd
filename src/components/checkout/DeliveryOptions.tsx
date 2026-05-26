"use client";

import { cn } from "@/lib/utils";

const labels = {
  heading: "Delivery",
  splitLabel: "Split delivery",
  splitDesc: "Receive in-stock items now. Pre-orders ship separately when the shipment lands.",
  togetherLabel: "Hold together",
  togetherDesc: "Wait for all items to be ready, then receive everything in one delivery.",
};

type DeliveryMethod = "split" | "together";

type DeliveryOptionsProps = {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
};

type OptionProps = {
  label: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
};

function Option({ label, desc, selected, onSelect }: OptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full text-left rounded-xl border px-4 py-3 transition-colors cursor-pointer",
        selected
          ? "border-ink bg-ink"
          : "border-line bg-paper hover:border-muted"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
            selected ? "border-paper" : "border-line"
          )}
        >
          {selected && (
            <span className="w-2 h-2 rounded-full bg-paper" />
          )}
        </span>
        <div>
          <p
            className={cn(
              "text-[14px] font-medium",
              selected ? "text-paper" : "text-ink"
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "text-[12px] mt-0.5",
              selected ? "text-paper/70" : "text-muted"
            )}
          >
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
}

export function DeliveryOptions({ value, onChange }: DeliveryOptionsProps) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-ink mb-3">{labels.heading}</h3>
      <div className="space-y-2">
        <Option
          label={labels.splitLabel}
          desc={labels.splitDesc}
          selected={value === "split"}
          onSelect={() => onChange("split")}
        />
        <Option
          label={labels.togetherLabel}
          desc={labels.togetherDesc}
          selected={value === "together"}
          onSelect={() => onChange("together")}
        />
      </div>
    </div>
  );
}
