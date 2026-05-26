import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as BDT currency — e.g. ৳12,500 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

/** Format a number as USD currency — e.g. $49.99 */
export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format an ISO date string for display.
 * @param iso - ISO date or datetime string
 * @param style - "short" → "28 May 2026" | "mono" → "28 MAY 2026" | "full" → locale long
 */
export function formatDate(
  iso: string,
  style: "short" | "mono" | "full" = "short"
): string {
  const date = new Date(iso);
  if (style === "mono") {
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en", {
      month: "short",
      timeZone: "UTC",
    }).toUpperCase();
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }
  if (style === "full") {
    return date.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  // short
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
