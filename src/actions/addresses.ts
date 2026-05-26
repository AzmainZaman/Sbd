"use server";

import { createClient } from "@/lib/supabase/server";
import { assertAuth } from "@/lib/auth-guard";
import type { Address, AddressInput } from "@/types/address";

function mapRow(
  row: {
    id: string;
    user_id: string;
    full_name: string | null;
    label: string | null;
    street_address: string;
    apt: string | null;
    area: string;
    city: string;
    postal_code: string;
    landmark: string | null;
  },
  defaultAddressId: string | null
): Address {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name ?? "",
    label: row.label,
    streetAddress: row.street_address,
    apt: row.apt,
    area: row.area,
    city: row.city,
    postalCode: row.postal_code,
    landmark: row.landmark,
    isDefault: row.id === defaultAddressId,
  };
}

export async function getAddresses(): Promise<Address[]> {
  const user = await assertAuth();
  const supabase = await createClient();

  const [addressesRes, profileRes] = await Promise.all([
    supabase
      .from("addresses")
      .select("id, user_id, full_name, label, street_address, apt, area, city, postal_code, landmark")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase.from("users").select("default_address_id").eq("id", user.id).single(),
  ]);

  const defaultId = profileRes.data?.default_address_id ?? null;
  const rows = (addressesRes.data ?? []) as Parameters<typeof mapRow>[0][];

  const mapped = rows.map((r) => mapRow(r, defaultId));
  return mapped.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
}

export async function createAddress(
  input: AddressInput,
  setAsDefault = false
): Promise<Address> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      full_name: input.fullName,
      label: input.label ?? null,
      street_address: input.streetAddress,
      apt: input.apt ?? null,
      area: input.area,
      city: input.city,
      postal_code: input.postalCode,
      landmark: input.landmark ?? null,
    })
    .select("id, user_id, full_name, label, street_address, apt, area, city, postal_code, landmark")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create address");
  const row = data as Parameters<typeof mapRow>[0];

  const { data: profile } = await supabase
    .from("users")
    .select("default_address_id")
    .eq("id", user.id)
    .single();

  const shouldSetDefault = setAsDefault || profile?.default_address_id == null;
  if (shouldSetDefault) {
    await supabase
      .from("users")
      .update({ default_address_id: row.id })
      .eq("id", user.id);
  }

  const defaultId = shouldSetDefault ? row.id : (profile?.default_address_id ?? null);
  return mapRow(row, defaultId);
}

export async function updateAddress(
  id: string,
  input: AddressInput
): Promise<void> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("addresses")
    .update({
      full_name: input.fullName,
      label: input.label ?? null,
      street_address: input.streetAddress,
      apt: input.apt ?? null,
      area: input.area,
      city: input.city,
      postal_code: input.postalCode,
      landmark: input.landmark ?? null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}

export async function deleteAddress(id: string): Promise<void> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("users")
    .select("default_address_id")
    .eq("id", user.id)
    .single();

  const wasDefault = profile?.default_address_id === id;

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  if (wasDefault) {
    const { data: remaining } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    await supabase
      .from("users")
      .update({ default_address_id: remaining?.id ?? null })
      .eq("id", user.id);
  }
}

export async function setDefaultAddress(id: string): Promise<void> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ default_address_id: id })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}
