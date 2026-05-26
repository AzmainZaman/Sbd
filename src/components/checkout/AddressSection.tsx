"use client";

import { useState, useTransition } from "react";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { createAddress } from "@/actions/addresses";
import type { Address, AddressInput } from "@/types/address";

const labels = {
  heading: "Delivery address",
  useDifferent: "Use a different address",
  useExisting: "Use a saved address",
  saveForLater: "Save this address to my account",
  noAddresses: "Enter your delivery address",
  required: "*",
};

const CITY_OPTIONS = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"];

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

type FormState = {
  fullName: string;
  streetAddress: string;
  apt: string;
  area: string;
  city: string;
  postalCode: string;
  landmark: string;
  save: boolean;
};

const EMPTY: FormState = {
  fullName: "",
  streetAddress: "",
  apt: "",
  area: "",
  city: "Dhaka",
  postalCode: "",
  landmark: "",
  save: false,
};

function formToInput(f: FormState): AddressInput {
  return {
    fullName: f.fullName.trim(),
    streetAddress: f.streetAddress.trim(),
    apt: f.apt.trim() || undefined,
    area: f.area.trim(),
    city: f.city,
    postalCode: f.postalCode.trim(),
    landmark: f.landmark.trim() || undefined,
  };
}

function addressOneLine(a: Address) {
  const parts = [a.streetAddress];
  if (a.apt) parts.push(a.apt);
  parts.push(a.area, `${a.city} ${a.postalCode}`);
  return parts.join(", ");
}

function AddressForm({
  onConfirm,
}: {
  onConfirm: (addressId: string) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof Omit<FormState, "save">) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const created = await createAddress(formToInput(form), form.save);
        onConfirm(created.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save address.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">
            Full name <span style={{ color: "var(--accent)" }}>{labels.required}</span>
          </label>
          <input required placeholder="Recipient name" className={inputClass} {...field("fullName")} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">
            Street address <span style={{ color: "var(--accent)" }}>{labels.required}</span>
          </label>
          <input required placeholder="House/road and street" className={inputClass} {...field("streetAddress")} />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">Apt / Floor</label>
          <input placeholder="Apt, floor (optional)" className={inputClass} {...field("apt")} />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">
            Area / Thana <span style={{ color: "var(--accent)" }}>{labels.required}</span>
          </label>
          <input required placeholder="e.g. Gulshan-2" className={inputClass} {...field("area")} />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">
            City <span style={{ color: "var(--accent)" }}>{labels.required}</span>
          </label>
          <select required className={inputClass} {...field("city")}>
            {CITY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">
            Postal code <span style={{ color: "var(--accent)" }}>{labels.required}</span>
          </label>
          <input required placeholder="e.g. 1212" className={inputClass} {...field("postalCode")} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">Landmark</label>
          <input placeholder="Near / Opposite (optional)" className={inputClass} {...field("landmark")} />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.save}
          onChange={(e) => setForm((f) => ({ ...f, save: e.target.checked }))}
          className="w-4 h-4 accent-ink rounded"
        />
        <span className="text-[13px] text-muted">{labels.saveForLater}</span>
      </label>

      {error && <p className="text-[13px]" style={{ color: "var(--accent)" }}>{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="h-10 px-5 rounded-xl bg-ink text-paper text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
      >
        {isPending ? "Saving…" : "Use this address"}
      </button>
    </form>
  );
}

export function AddressSection({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const hasSaved = addresses.length > 0;
  const [showForm, setShowForm] = useState(!hasSaved);
  const selected = addresses.find((a) => a.id === selectedId);

  function handleFormConfirm(id: string) {
    onSelect(id);
    setShowForm(false);
  }

  return (
    <div>
      {/* Saved address tiles */}
      {hasSaved && !showForm && (
        <div className="space-y-3">
          {addresses.map((a) => {
            const isSelected = a.id === selectedId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelect(a.id)}
                className="w-full text-left rounded-xl border px-4 py-3 transition-colors cursor-pointer"
                style={{
                  borderColor: isSelected ? "var(--ink)" : "var(--line)",
                  backgroundColor: isSelected ? "var(--bg)" : "var(--paper)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      {a.label && (
                        <span className="text-[13px] font-semibold text-ink">{a.label}</span>
                      )}
                      {a.isDefault && <Chip variant="line">Default</Chip>}
                    </div>
                    <p className="text-[13px] font-medium text-ink">{a.fullName}</p>
                    <p className="text-[12px] text-muted mt-0.5">{addressOneLine(a)}</p>
                  </div>
                  {isSelected && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-ink flex items-center justify-center mt-0.5">
                      <Icon name="check" size={12} className="text-paper" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => { setShowForm(true); onSelect(null); }}
            className="text-[13px] font-medium text-muted hover:text-ink transition-colors cursor-pointer"
          >
            {labels.useDifferent}
          </button>
        </div>
      )}

      {/* Show current selected summary when form is open and we had a selection */}
      {hasSaved && showForm && selected && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-[13px] font-medium text-muted hover:text-ink transition-colors cursor-pointer"
          >
            ← {labels.useExisting}
          </button>
        </div>
      )}

      {/* Inline form */}
      {showForm && <AddressForm onConfirm={handleFormConfirm} />}

      {/* Empty state before confirming form */}
      {!hasSaved && !showForm && (
        <p className="text-[13px] text-muted">{labels.noAddresses}</p>
      )}
    </div>
  );
}
