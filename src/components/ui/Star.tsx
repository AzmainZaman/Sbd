import { cn } from "@/lib/utils";

type StarState = "full" | "half" | "empty";

type StarProps = {
  state?: StarState;
  size?: number;
  className?: string;
};

const STAR_PATH =
  "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z";

export function Star({ state = "empty", size = 16, className }: StarProps) {
  const id = `half-${size}`;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {state === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="var(--warn)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d={STAR_PATH}
        fill={
          state === "full"
            ? "var(--warn)"
            : state === "half"
              ? `url(#${id})`
              : "none"
        }
        stroke={state === "empty" ? "var(--line)" : "var(--warn)"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Convenience: render up to 5 stars for a numeric rating (0–5, supports .5) */
export function StarRating({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const stars: StarState[] = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {stars.map((s, i) => (
        <Star key={i} state={s} size={size} />
      ))}
    </span>
  );
}
