import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "stock" | "pre" | "accent" | "line" | "dark" | "default";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

const variantClasses: Record<ChipVariant, string> = {
  stock: "bg-[#e8f5ee] text-[var(--ok)] border border-[#c3e6d4]",
  pre: "bg-[var(--accent-soft)] text-[var(--accent)] border border-[#f5cfc6]",
  accent: "bg-[var(--accent)] text-[var(--paper)]",
  line: "bg-transparent text-[var(--ink)] border border-[var(--line)]",
  dark: "bg-[var(--ink)] text-[var(--paper)]",
  default: "bg-[var(--line)] text-[var(--muted)]",
};

export function Chip({
  variant = "default",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium leading-5 whitespace-nowrap",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {variant === "stock" && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
