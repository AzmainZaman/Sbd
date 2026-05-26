"use server";

import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth-guard";
import { sendQuoteEmail } from "@/lib/email";
import type { Quote, QuoteStatus } from "@/types/quote";
import type { CountryCode } from "@/types/product";

type DbQuote = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  requested_at: string;
  source_url: string;
  source_retailer: string;
  origin_country: string;
  product_name: string;
  product_variant: string | null;
  quantity: number;
  notes: string | null;
  preferred_shipment_id: string | null;
  budget_ceiling_bdt: number | null;
  status: string;
  expires_at: string | null;
  item_price_bdt: number | null;
  duty_bdt: number | null;
  inbound_shipping_bdt: number | null;
  handling_bdt: number | null;
  total_bdt: number | null;
  shipment_id: string | null;
  eta: string | null;
  admin_note: string | null;
  margin_pct: number | null;
};

function mapDbQuote(row: DbQuote): Quote {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone ?? undefined,
    requestedAt: row.requested_at,
    sourceUrl: row.source_url,
    sourceRetailer: row.source_retailer,
    originCountry: row.origin_country as CountryCode,
    productName: row.product_name,
    productVariant: row.product_variant ?? undefined,
    quantity: row.quantity,
    notes: row.notes ?? undefined,
    preferredShipmentId: row.preferred_shipment_id ?? undefined,
    budgetCeilingBDT: row.budget_ceiling_bdt ?? undefined,
    status: row.status as QuoteStatus,
    expiresAt: row.expires_at ?? undefined,
    itemPriceBDT: row.item_price_bdt ?? undefined,
    dutyBDT: row.duty_bdt ?? undefined,
    inboundShippingBDT: row.inbound_shipping_bdt ?? undefined,
    handlingBDT: row.handling_bdt ?? undefined,
    totalBDT: row.total_bdt ?? undefined,
    shipmentId: row.shipment_id ?? undefined,
    eta: row.eta ?? undefined,
    adminNote: row.admin_note ?? undefined,
    marginPct: row.margin_pct ?? undefined,
  };
}

export async function getAdminQuoteInbox(): Promise<Quote[]> {
  await assertAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("requested_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapDbQuote(row as DbQuote));
}

export type QuotePricing = {
  itemPriceBDT: number;
  dutyBDT: number;
  inboundShippingBDT: number;
  handlingBDT: number;
  shipmentId: string;
  eta: string;
  adminNote?: string;
};

export async function sendQuote(quoteId: string, pricing: QuotePricing): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const totalBDT =
    pricing.itemPriceBDT +
    pricing.dutyBDT +
    pricing.inboundShippingBDT +
    pricing.handlingBDT;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const { data: updatedQuote, error: updateError } = await supabase
    .from("quotes")
    .update({
      item_price_bdt: pricing.itemPriceBDT,
      duty_bdt: pricing.dutyBDT,
      inbound_shipping_bdt: pricing.inboundShippingBDT,
      handling_bdt: pricing.handlingBDT,
      total_bdt: totalBDT,
      shipment_id: pricing.shipmentId,
      eta: pricing.eta,
      admin_note: pricing.adminNote ?? null,
      status: "quote-sent",
      expires_at: expiresAt,
      updated_at: now,
    })
    .eq("id", quoteId)
    .select("customer_id, customer_name, product_name, total_bdt, expires_at")
    .single();

  if (updateError) throw new Error(updateError.message);

  const { data: customer } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", updatedQuote.customer_id)
    .single();

  if (customer) {
    await sendQuoteEmail({
      id: quoteId,
      email: customer.email,
      name: customer.name,
      productName: updatedQuote.product_name,
      totalBDT: updatedQuote.total_bdt ?? totalBDT,
      expiresAt: updatedQuote.expires_at ?? undefined,
    }).catch(() => {});
  }
}
