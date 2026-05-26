import type { CountryCode } from "./product";

export type ShipmentStatus =
  | "accepting"
  | "cutoff"
  | "outbound"
  | "in-transit"
  | "customs"
  | "delivery"
  | "delivered";

export type ShipmentMilestone = {
  label: string;
  completedAt?: string; // ISO datetime if done
};

export type ShipmentBreakdown = {
  category: string;
  itemCount: number;
  valueBDT: number;
};

export type Shipment = {
  id: string;
  number: number;
  route: string; // e.g. "USA → DAC"
  originCountry: CountryCode;
  cutoffDate: string; // ISO datetime
  liftoffDate: string; // ISO date
  landingDate: string; // ISO date (Dhaka arrival)
  status: ShipmentStatus;
  itemCount: number;
  totalValueBDT: number;
  customerNote?: string;
  milestones: ShipmentMilestone[];
  breakdown?: ShipmentBreakdown[];
};
