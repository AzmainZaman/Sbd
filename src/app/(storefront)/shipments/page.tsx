import { shipments } from "@/data/shipments";
import { ShipmentsClient } from "./ShipmentsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipment Schedule — SBD Global Shopping",
  description:
    "View all active and upcoming shipments from the USA and UK. Check cutoff dates, milestones, and estimated delivery timelines.",
};

export default function ShipmentsPage() {
  return <ShipmentsClient shipments={shipments} />;
}
