"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/addresses";
import type { Address, AddressInput } from "@/types/address";

const labels = {
  heading: "Saved Addresses",
  sub: "Manage your delivery addresses. The default address is pre-selected at checkout.",
  addNew: "Add address",
  defaultBadge: "Default",
  makeDefault: "Set as default",
  edit: "Edit",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save address",
  saving: "Saving…",
  empty: "No saved addresses yet. Add one below.",
  confirmDelete: "Delete this address?",
};

const CITY_OPTIONS = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"];

type FormData = {
  fullName: string;
  label: string;
  streetAddress: string;
  apt: string;
  area: string;
  city: string;
  postalCode: string;
  landmark: string;
};

const EMPTY_FORM: FormData = {
  fullName: "",
  label: "",
  streetAddress: "",
  apt: "",
  area: "",
  city: "Dhaka",
  postalCode: "",
  landmark: "",
};

function toInput(f: FormData): AddressInput {
  return {
    fullName: f.fullName.trim(),
    label: f.label.trim() || undefined,
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

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FormData;
  onSave: (input: AddressInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial ?? EMPTY_FORM);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof FormData) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await onSave(toInput(form));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">
            Full name <span className="text-accent">*</span>
          </label>
          <input required placeholder="Recipient's full name" className={inputClass} {...field("fullName")} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">Street address <span className="text-accent">*</span></label>
          <input required placeholder="House/road number and street" className={inputClass} {...field("streetAddress")} />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">Apt / Floor</label>
          <input placeholder="Apt, floor, building (optional)" className={inputClass} {...field("apt")} />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">Area / Thana <span className="text-accent">*</span></label>
          <input required placeholder="e.g. Gulshan-2" className={inputClass} {...field("area")} />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">City <span className="text-accent">*</span></label>
          <select required className={inputClass} {...field("city")}>
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink mb-1">Postal code <span className="text-accent">*</span></label>
          <input required placeholder="e.g. 1212" className={inputClass} {...field("postalCode")} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">Landmark</label>
          <input placeholder="e.g. Opposite BRAC Bank (optional)" className={inputClass} {...field("landmark")} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[12px] font-medium text-ink mb-1">Label</label>
          <input placeholder="e.g. Home, Work (optional)" className={inputClass} {...field("label")} />
        </div>
      </div>

      {error && <p className="text-[13px] text-accent">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="md" disabled={isPending}>
          {isPending ? labels.saving : labels.save}
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          {labels.cancel}
        </Button>
      </div>
    </form>
  );
}

function AddressCard({
  address,
  onRefresh,
}: {
  address: Address;
  onRefresh: (updated: Address[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSetDefault() {
    startTransition(async () => {
      await setDefaultAddress(address.id);
      const { getAddresses } = await import("@/actions/addresses");
      onRefresh(await getAddresses());
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteAddress(address.id);
      const { getAddresses } = await import("@/actions/addresses");
      onRefresh(await getAddresses());
    });
  }

  async function handleSave(input: AddressInput) {
    await updateAddress(address.id, input);
    const { getAddresses } = await import("@/actions/addresses");
    onRefresh(await getAddresses());
    setEditing(false);
  }

  const initial: FormData = {
    fullName: address.fullName,
    label: address.label ?? "",
    streetAddress: address.streetAddress,
    apt: address.apt ?? "",
    area: address.area,
    city: address.city,
    postalCode: address.postalCode,
    landmark: address.landmark ?? "",
  };

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {address.label && (
            <span className="text-[13px] font-semibold text-ink">{address.label}</span>
          )}
          {address.isDefault && (
            <Chip variant="stock">{labels.defaultBadge}</Chip>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-[12px] text-muted hover:text-ink transition-colors cursor-pointer"
          >
            {labels.edit}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-[12px] text-muted hover:text-accent transition-colors cursor-pointer"
          >
            {labels.delete}
          </button>
        </div>
      </div>

      {!editing && (
        <>
          <p className="text-[14px] font-medium text-ink">{address.fullName}</p>
          <p className="text-[13px] text-muted mt-0.5">{addressOneLine(address)}</p>
          {address.landmark && (
            <p className="text-[12px] text-muted mt-0.5">Near: {address.landmark}</p>
          )}
          {!address.isDefault && (
            <button
              onClick={handleSetDefault}
              disabled={isPending}
              className="mt-3 text-[12px] font-medium text-ink hover:opacity-70 transition-opacity disabled:opacity-40 cursor-pointer"
            >
              {labels.makeDefault}
            </button>
          )}
        </>
      )}

      {editing && (
        <AddressForm
          initial={initial}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}

      {confirmDelete && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-[13px] text-muted">{labels.confirmDelete}</p>
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
            {labels.cancel}
          </Button>
          <Button variant="accent" size="sm" onClick={handleDelete} disabled={isPending}>
            {labels.delete}
          </Button>
        </div>
      )}
    </div>
  );
}

export function AddressesClient({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(input: AddressInput) {
    await createAddress(input, addresses.length === 0);
    const { getAddresses } = await import("@/actions/addresses");
    setAddresses(await getAddresses());
    setShowForm(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-ink">{labels.heading}</h1>
          <p className="text-[13px] text-muted mt-1">{labels.sub}</p>
        </div>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={16} className="mr-1.5" />
            {labels.addNew}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-line bg-paper p-5 mb-5">
          <h2 className="text-[15px] font-semibold text-ink mb-4">{labels.addNew}</h2>
          <AddressForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {addresses.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-line py-12 text-center">
          <p className="text-[15px] text-muted">{labels.empty}</p>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((a) => (
          <AddressCard key={a.id} address={a} onRefresh={setAddresses} />
        ))}
      </div>
    </div>
  );
}
