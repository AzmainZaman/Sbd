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
