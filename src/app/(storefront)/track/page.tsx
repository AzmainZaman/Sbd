import type { Metadata } from "next";
import { TrackClient } from "./TrackClient";

export const metadata: Metadata = {
  title: "Track your order — SBD Global Shopping",
  description: "Enter your SBD order ID to see the latest status of your shipment.",
};

export default function TrackPage() {
  return <TrackClient />;
}
