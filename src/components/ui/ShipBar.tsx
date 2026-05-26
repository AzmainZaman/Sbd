import { cn } from "@/lib/utils";

type ShipBarProps = {
  /** 0–100 */
  progress: number;
  /** Number of milestone steps to show as dots */
  steps?: number;
  /** Use accent color for the fill instead of ok/green */
  accent?: boolean;
  className?: string;
};

export function ShipBar({
  progress,
  steps,
  accent = false,
  className,
}: ShipBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            accent ? "bg-[var(--accent)]" : "bg-[var(--ok)]"
          )}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {steps !== undefined && steps > 1 && (
        <div className="relative flex justify-between mt-1.5">
          {Array.from({ length: steps }, (_, i) => {
            const stepProgress = (i / (steps - 1)) * 100;
            const done = stepProgress <= clampedProgress;
            return (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full border",
                  done
                    ? accent
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "bg-[var(--ok)] border-[var(--ok)]"
                    : "bg-[var(--paper)] border-[var(--line)]"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
