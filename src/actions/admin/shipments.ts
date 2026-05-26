"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth-guard";
import { mapShipment } from "@/lib/db";
import type { Shipment, ShipmentStatus } from "@/types/shipment";
import type { Database } from "@/types/database";

type ShipmentUpdateRow = Database["public"]["Tables"]["shipments"]["Update"];

export type ShipmentInput = {
  id: string;
  number: number;
  route: string;
  originCountry: string;
  cutoffDate: string;
  liftoffDate: string;
  landingDate: string;
  status: ShipmentStatus;
  itemCount?: number;
  totalValueBDT?: number;
  customerNote?: string;
};

export async function getAllShipmentsAdmin(): Promise<Shipment[]> {
  await assertAdmin();
  const supabase = await createClient();

  const [shipmentsRes, milestonesRes, breakdownsRes] = await Promise.all([
    supabase.from("shipments").select("*").order("number", { ascending: false }),
    supabase
      .from("shipment_milestones")
      .select("*")
      .order("position", { ascending: true }),
    supabase.from("shipment_breakdowns").select("*"),
  ]);

  const rows = shipmentsRes.data ?? [];
  const milestones = milestonesRes.data ?? [];
  const breakdowns = breakdownsRes.data ?? [];

  return rows.map((s) =>
    mapShipment(
      s,
      milestones.filter((m) => m.shipment_id === s.id),
      breakdowns.filter((b) => b.shipment_id === s.id)
    )
  );
}

export async function createShipment(input: ShipmentInput): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("shipments").insert({
    id: input.id,
    number: input.number,
    route: input.route,
    origin_country: input.originCountry,
    cutoff_date: input.cutoffDate,
    liftoff_date: input.liftoffDate,
    landing_date: input.landingDate,
    status: input.status,
    item_count: input.itemCount ?? 0,
    total_value_bdt: input.totalValueBDT ?? 0,
    customer_note: input.customerNote ?? null,
  });

  if (error) throw error;

  revalidatePath("/shipments");
  revalidatePath("/admin/shipments");
}

export async function updateShipment(
  id: string,
  input: Partial<ShipmentInput>
): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const patch: ShipmentUpdateRow = {
    ...(input.route !== undefined && { route: input.route }),
    ...(input.originCountry !== undefined && { origin_country: input.originCountry }),
    ...(input.cutoffDate !== undefined && { cutoff_date: input.cutoffDate }),
    ...(input.liftoffDate !== undefined && { liftoff_date: input.liftoffDate }),
    ...(input.landingDate !== undefined && { landing_date: input.landingDate }),
    ...(input.itemCount !== undefined && { item_count: input.itemCount }),
    ...(input.totalValueBDT !== undefined && { total_value_bdt: input.totalValueBDT }),
    ...(input.customerNote !== undefined && { customer_note: input.customerNote }),
  };

  const { error } = await supabase.from("shipments").update(patch).eq("id", id);
  if (error) throw error;

  revalidatePath("/shipments");
  revalidatePath("/admin/shipments");
}

export async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus
): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("shipments")
    .update({ status })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/shipments");
  revalidatePath("/admin/shipments");
}

export async function updateMilestone(
  milestoneId: string,
  completedAt: string | null
): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("shipment_milestones")
    .update({ completed_at: completedAt })
    .eq("id", milestoneId);

  if (error) throw error;

  revalidatePath("/shipments");
  revalidatePath("/admin/shipments");
}
