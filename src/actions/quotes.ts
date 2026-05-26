"use server";

import { createClient } from "@/lib/supabase/server";
import { assertAuth } from "@/lib/auth-guard";
import type { Quote, QuoteStatus } from "@/types/quote";
import type { CountryCode } from "@/types/product";

function generateQuoteId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `QR-${year}-${num}`;
}

function detectRetailer(url: string): { retailer: string; originCountry: CountryCode } {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.endsWith(".co.uk") || host === "amazon.co.uk") {
      return { retailer: host, originCountry: "UK" };
    }
    return { retailer: host, originCountry: "US" };
  } catch {
    return { retailer: "Unknown", originCountry: "US" };
  }
}

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

type CreateQuoteInput = {
  sourceUrl: string;
  productName: string;
  productVariant?: string;
  quantity: number;
  notes?: string;
  preferredShipmentId?: string;
  budgetCeilingBDT?: number;
};

export async function createQuote(input: CreateQuoteInput): Promise<{ quoteId: string }> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  const { retailer, originCountry } = detectRetailer(input.sourceUrl);
  const quoteId = generateQuoteId();

  const { error } = await supabase.from("quotes").insert({
    id: quoteId,
    customer_id: user.id,
    customer_name: profile?.name ?? "Customer",
    source_url: input.sourceUrl,
    source_retailer: retailer,
    origin_country: originCountry,
    product_name: input.productName,
    product_variant: input.productVariant ?? null,
    quantity: input.quantity,
    notes: input.notes ?? null,
    preferred_shipment_id: input.preferredShipmentId ?? null,
    budget_ceiling_bdt: input.budgetCeilingBDT ?? null,
    status: "pending",
    requested_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  return { quoteId };
}

export async function getQuotesByCustomer(): Promise<Quote[]> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("customer_id", user.id)
    .order("requested_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapDbQuote(row as DbQuote));
}

export async function getQuote(quoteId: string): Promise<Quote | null> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .eq("customer_id", user.id)
    .single();

  if (error || !data) return null;
  return mapDbQuote(data as DbQuote);
}

export type AcceptQuoteResult = {
  productName: string;
  productVariant?: string;
  totalBDT: number;
  quantity: number;
  shipmentId?: string;
  eta?: string;
};

export async function acceptQuote(quoteId: string): Promise<AcceptQuoteResult> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .eq("customer_id", user.id)
    .single();

  if (fetchError || !existing) throw new Error("Quote not found");

  const q = existing as DbQuote;
  if (q.status !== "quote-sent") throw new Error("Quote is not available for acceptance");

  const { error } = await supabase
    .from("quotes")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);

  return {
    productName: q.product_name,
    productVariant: q.product_variant ?? undefined,
    totalBDT: q.total_bdt ?? 0,
    quantity: q.quantity,
    shipmentId: q.shipment_id ?? undefined,
    eta: q.eta ?? undefined,
  };
}

export async function declineQuote(quoteId: string): Promise<void> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("quotes")
    .update({ status: "declined", updated_at: new Date().toISOString() })
    .eq("id", quoteId)
    .eq("customer_id", user.id);

  if (error) throw new Error(error.message);
}
