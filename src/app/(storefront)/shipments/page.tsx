import { createClient } from "@/lib/supabase/server";
import { mapShipment } from "@/lib/db";
import { ShipmentsClient } from "./ShipmentsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipment Schedule — SBD Global Shopping",
  description:
    "View all active and upcoming shipments from the USA and UK. Check cutoff dates, milestones, and estimated delivery timelines.",
};

export default async function ShipmentsPage() {
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

  const shipments = rows.map((s) =>
    mapShipment(
      s,
      milestones.filter((m) => m.shipment_id === s.id),
      breakdowns.filter((b) => b.shipment_id === s.id)
    )
  );

  return <ShipmentsClient shipments={shipments} />;
}
