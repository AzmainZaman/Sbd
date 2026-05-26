import { shipments } from "@/data/shipments";
import { products } from "@/data/products";
import type { Shipment } from "@/types/shipment";

/**
 * Returns the soonest open (status === "accepting") shipment and milliseconds
 * until its cutoff. Returns null if no open shipment exists.
 */
export function getNextCutoff(): {
  shipment: Shipment;
  msUntilCutoff: number;
} | null {
  const now = Date.now();

  const open = shipments
    .filter((s) => s.status === "accepting")
    .map((s) => ({
      shipment: s,
      msUntilCutoff: new Date(s.cutoffDate).getTime() - now,
    }))
    .filter((s) => s.msUntilCutoff > 0)
    .sort((a, b) => a.msUntilCutoff - b.msUntilCutoff);

  return open[0] ?? null;
}

/**
 * Format milliseconds into a human-readable countdown — e.g. "4d 22h" or "3h 15m".
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0h";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Look up the shipment assigned to a given product ID.
 */
export function getShipmentForProduct(productId: string): Shipment | null {
  const product = products.find((p) => p.id === productId);
  if (!product?.shipmentId) return null;
  return shipments.find((s) => s.id === product.shipmentId) ?? null;
}
