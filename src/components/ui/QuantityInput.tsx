"use client";

import { cn } from "@/lib/utils";

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: QuantityInputProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-[var(--line)] rounded-xl overflow-hidden",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "w-9 h-9 flex items-center justify-center text-[var(--muted)] transition-colors cursor-pointer",
          "hover:bg-[var(--line)] disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M19.5 12h-15" />
        </svg>
      </button>

      <span
        className="w-9 h-9 flex items-center justify-center text-[14px] font-medium text-[var(--ink)] select-none"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={cn(
          "w-9 h-9 flex items-center justify-center text-[var(--muted)] transition-colors cursor-pointer",
          "hover:bg-[var(--line)] disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}
