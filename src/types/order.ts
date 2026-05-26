export type PaymentMethod = "bkash" | "nagad" | "card" | "cod";

export type Address = {
  id: string;
  label?: string; // "Home", "Office"
  streetAddress: string;
  apt?: string;
  area: string;
  city: string;
  postalCode: string;
  landmark?: string;
};

export type OrderStatus =
  | "placed"
  | "sourcing"
  | "outbound"
  | "in-transit"
  | "customs"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export type OrderLine = {
  id?: string;
  productId: string;
  productName: string;
  variant?: string;
  quantity: number;
  unitPriceBDT: number;
  totalBDT: number;
  type: "in-stock" | "pre-order";
  quoteId?: string;
};

export type TrackingStep = {
  id?: string;
  label: string;
  description: string;
  occurredAt?: string; // ISO datetime — maps to DB column occurred_at
  status: "done" | "current" | "pending";
  position?: number;
};

export type Order = {
  id: string; // e.g. "SBD-2026-04812"
  customerId: string;
  placedAt: string; // ISO datetime
  status: OrderStatus;
  type: "in-stock" | "pre-order" | "mixed";
  lines: OrderLine[];
  deliveryAddress?: Address;
  deliveryMethod: "split" | "together";
  shippingBDT: number;
  dutyBDT: number;
  handlingBDT: number;
  localDeliveryBDT: number;
  subtotalBDT: number;
  totalBDT: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentReference?: string; // manual bKash/Nagad/card transaction ID entered by admin
  inStockEta?: string; // ISO date
  preOrderEta?: string; // ISO date
  shipmentId?: string;
  trackingSteps: TrackingStep[];
};
