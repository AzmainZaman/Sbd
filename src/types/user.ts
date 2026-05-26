export type { Address } from "./order";

export type User = {
  id: string;
  name: string;
  phone: string; // primary identifier (OTP auth in Phase 2)
  email?: string;
  addresses: import("./order").Address[];
  defaultAddressId?: string;
  memberTier: "standard" | "silver" | "gold";
  points: number;
  joinedAt: string; // ISO date
  role: "customer" | "admin";
};
