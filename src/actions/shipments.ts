"use server";

import { createClient } from "@/lib/supabase/server";
import { mapShipment } from "@/lib/db";
import type { Shipment } from "@/types/shipment";

export async function fetchNextCutoff(): Promise<{
  route: string;
  cutoffDate: string;
  landingDate: string;
  number: number;
} | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipments")
    .select("id, route, cutoff_date, landing_date, number")
    .eq("status", "accepting")
    .order("cutoff_date", { ascending: true })
    .limit(5);

  if (!data || data.length === 0) return null;

  const now = Date.now();
  const open = data
    .map((s) => ({ ...s, ms: new Date(s.cutoff_date).getTime() - now }))
    .filter((s) => s.ms > 0)
    .sort((a, b) => a.ms - b.ms);

  if (!open.length) return null;
  return {
    route: open[0].route,
    cutoffDate: open[0].cutoff_date,
    landingDate: open[0].landing_date,
    number: open[0].number,
  };
}

export type OpenShipmentSummary = {
  id: string;
  number: number;
  route: string;
  cutoffDate: string;
  itemCount: number;
  customerNote?: string;
};

export async function fetchOpenShipments(): Promise<OpenShipmentSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipments")
    .select("id, number, route, cutoff_date, item_count, customer_note")
    .eq("status", "accepting")
    .order("cutoff_date", { ascending: true });

  return (data ?? []).map((s) => ({
    id: s.id,
    number: s.number,
    route: s.route,
    cutoffDate: s.cutoff_date,
    itemCount: s.item_count,
    customerNote: s.customer_note ?? undefined,
  }));
}

export async function fetchShipmentById(id: string): Promise<Shipment | null> {
  const supabase = await createClient();

  const [shipmentRes, milestonesRes, breakdownsRes] = await Promise.all([
    supabase.from("shipments").select("*").eq("id", id).single(),
    supabase
      .from("shipment_milestones")
      .select("*")
      .eq("shipment_id", id)
      .order("position", { ascending: true }),
    supabase.from("shipment_breakdowns").select("*").eq("shipment_id", id),
  ]);

  if (!shipmentRes.data) return null;

  return mapShipment(
    shipmentRes.data,
    milestonesRes.data ?? [],
    breakdownsRes.data ?? []
  );
}
