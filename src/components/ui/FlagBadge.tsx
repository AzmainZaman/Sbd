import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { CountryCode } from "@/types/product";

type FlagBadgeProps = {
  country: CountryCode;
  size?: number;
  className?: string;
};

const FLAGS: Record<CountryCode, ReactElement> = {
  US: (
    // Red + white stripes, blue canton
    <>
      {/* stripes */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x="0" y={i * 2} width="20" height="2" fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"} />
      ))}
      {/* canton */}
      <rect x="0" y="0" width="8" height="7" fill="#3C3B6E" />
      {/* simplified stars row */}
      {[1, 3, 5].map((y) =>
        [1, 3, 5, 7].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" fill="#FFFFFF" />
        ))
      )}
    </>
  ),
  UK: (
    // Union Jack — simplified: blue + white diagonals + red cross
    <>
      <rect width="20" height="14" fill="#012169" />
      {/* white diagonals */}
      <line x1="0" y1="0" x2="20" y2="14" stroke="#FFFFFF" strokeWidth="3.5" />
      <line x1="20" y1="0" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="3.5" />
      {/* red diagonals */}
      <line x1="0" y1="0" x2="20" y2="14" stroke="#C8102E" strokeWidth="1.8" />
      <line x1="20" y1="0" x2="0" y2="14" stroke="#C8102E" strokeWidth="1.8" />
      {/* white cross */}
      <rect x="8" y="0" width="4" height="14" fill="#FFFFFF" />
      <rect x="0" y="5" width="20" height="4" fill="#FFFFFF" />
      {/* red cross */}
      <rect x="8.8" y="0" width="2.4" height="14" fill="#C8102E" />
      <rect x="0" y="5.8" width="20" height="2.4" fill="#C8102E" />
    </>
  ),
  EU: (
    // Blue with circle of 12 yellow stars
    <>
      <rect width="20" height="14" fill="#003399" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 10 + 4 * Math.cos(angle);
        const cy = 7 + 4 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="0.8" fill="#FFCC00" />;
      })}
    </>
  ),
  CN: (
    // Red + large yellow star + 4 small stars
    <>
      <rect width="20" height="14" fill="#DE2910" />
      {/* large star — simplified as circle */}
      <polygon points="4,2.5 4.7,4.5 6.8,4.5 5.2,5.7 5.8,7.7 4,6.5 2.2,7.7 2.8,5.7 1.2,4.5 3.3,4.5" fill="#FFDE00" />
      {/* 4 small stars */}
      {[[8, 1], [10, 2.5], [10, 4.5], [8.5, 6]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="#FFDE00" />
      ))}
    </>
  ),
  AU: (
    // Blue ensign with Union Jack + Southern Cross (simplified)
    <>
      <rect width="20" height="14" fill="#00008B" />
      {/* simplified Union Jack in top-left */}
      <rect x="0" y="0" width="8" height="5.5" fill="#012169" />
      <line x1="0" y1="0" x2="8" y2="5.5" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="8" y1="0" x2="0" y2="5.5" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="3.2" y="0" width="1.6" height="5.5" fill="#FFFFFF" />
      <rect x="0" y="2.15" width="8" height="1.2" fill="#FFFFFF" />
      <line x1="0" y1="0" x2="8" y2="5.5" stroke="#C8102E" strokeWidth="0.8" />
      <line x1="8" y1="0" x2="0" y2="5.5" stroke="#C8102E" strokeWidth="0.8" />
      <rect x="3.6" y="0" width="0.8" height="5.5" fill="#C8102E" />
      <rect x="0" y="2.55" width="8" height="0.4" fill="#C8102E" />
      {/* Southern Cross — 5 white dots */}
      {[[14, 3], [17, 5], [13, 7], [16, 9], [18.5, 7]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.7" fill="#FFFFFF" />
      ))}
    </>
  ),
  AE: (
    // Green top, white middle, black bottom + red left stripe
    <>
      <rect x="0" y="0" width="20" height="4.67" fill="#00732F" />
      <rect x="0" y="4.67" width="20" height="4.67" fill="#FFFFFF" />
      <rect x="0" y="9.33" width="20" height="4.67" fill="#000000" />
      <rect x="0" y="0" width="5.5" height="14" fill="#FF0000" />
    </>
  ),
  BD: (
    // Green background + offset red circle
    <>
      <rect width="20" height="14" fill="#006A4E" />
      <circle cx="9.5" cy="7" r="3.5" fill="#F42A41" />
    </>
  ),
};

const COUNTRY_LABELS: Record<CountryCode, string> = {
  US: "USA",
  UK: "UK",
  EU: "Europe",
  CN: "China",
  AU: "Australia",
  AE: "UAE",
  BD: "Bangladesh",
};

export function FlagBadge({ country, size = 20, className }: FlagBadgeProps) {
  const height = Math.round(size * 0.7);

  return (
    <svg
      viewBox="0 0 20 14"
      width={size}
      height={height}
      aria-label={COUNTRY_LABELS[country]}
      role="img"
      className={cn("rounded-[2px] overflow-hidden shrink-0", className)}
      style={{ display: "inline-block" }}
    >
      {FLAGS[country]}
    </svg>
  );
}
