import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getOrdersByCustomer } from "@/actions/orders";
import { TrackOrdersView, TrackLoginPrompt } from "./TrackClient";

export const metadata: Metadata = {
  title: "Track your order — SBD Global Shopping",
  description: "See live shipment status, ETAs, and delivery updates for all your orders.",
};

export default async function TrackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <TrackLoginPrompt />;
  }

  const orders = await getOrdersByCustomer();
  return <TrackOrdersView orders={orders} />;
}
