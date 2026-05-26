import { cn } from "@/lib/utils";
import { formatBDT, formatUSD } from "@/lib/utils";

type MoneySize = "sm" | "md" | "lg";

type MoneyProps = {
  bdt: number;
  usd?: number;
  size?: MoneySize;
  /** Show BDT and USD stacked (USD as smaller sub-label in mono) */
  showUsd?: boolean;
  className?: string;
};

const bdtSizeClasses: Record<MoneySize, string> = {
  sm: "text-[14px] font-semibold",
  md: "text-[18px] font-semibold",
  lg: "text-[24px] font-semibold",
};

const usdSizeClasses: Record<MoneySize, string> = {
  sm: "text-[11px]",
  md: "text-[12px]",
  lg: "text-[13px]",
};

export function Money({
  bdt,
  usd,
  size = "md",
  showUsd = false,
  className,
}: MoneyProps) {
  return (
    <span className={cn("inline-flex flex-col leading-tight", className)}>
      <span className={cn("text-[var(--ink)]", bdtSizeClasses[size])}>
        {formatBDT(bdt)}
      </span>
      {showUsd && usd !== undefined && (
        <span
          className={cn(
            "text-[var(--muted)] font-mono",
            usdSizeClasses[size]
          )}
        >
          {formatUSD(usd)}
        </span>
      )}
    </span>
  );
}
