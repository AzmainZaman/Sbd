export type { Address } from "./order";

export type User = {
  id: string;
  name: string;
  email: string;  // primary identifier — email OTP auth in Phase 2
  phone?: string; // optional contact field; SMS OTP deferred to Phase 3
  addresses: import("./order").Address[];
  defaultAddressId?: string;
  memberTier: "standard" | "silver" | "gold";
  points: number;
  joinedAt: string; // ISO date
  role: "customer" | "admin";
};
