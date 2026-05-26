import type { CountryCode } from "./product";

export type QuoteStatus =
  | "pending"
  | "quote-sent"
  | "customer-replied"
  | "accepted"
  | "declined"
  | "expired";

export type Quote = {
  id: string; // e.g. "QR-2026-08412"
  customerId: string;
  customerName: string;
  customerPhone?: string; // optional until Phase 3 SMS OTP
  requestedAt: string; // ISO datetime
  sourceUrl: string;
  sourceRetailer: string;
  originCountry: CountryCode;
  productName: string;
  productVariant?: string;
  quantity: number;
  notes?: string;
  preferredShipmentId?: string;
  budgetCeilingBDT?: number;
  status: QuoteStatus;
  expiresAt?: string; // ISO datetime
  // Pricing (filled when admin sends quote)
  itemPriceBDT?: number;
  dutyBDT?: number;
  inboundShippingBDT?: number;
  handlingBDT?: number;
  totalBDT?: number;
  shipmentId?: string;
  eta?: string; // ISO date
  adminNote?: string;
  /** Internal only — not shown to customer */
  marginPct?: number;
};
