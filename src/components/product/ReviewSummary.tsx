import { StarRating } from "@/components/ui/Star";

type ReviewSummaryProps = {
  rating: number;
  reviewCount: number;
};

const distribution: Record<number, number> = { 5: 68, 4: 18, 3: 8, 2: 4, 1: 2 };

const labels = {
  outOf: "out of 5",
  reviews: "reviews",
};

export function ReviewSummary({ rating, reviewCount }: ReviewSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <div className="text-center sm:text-left flex-shrink-0">
        <p className="text-[48px] font-semibold leading-none text-ink">{rating.toFixed(1)}</p>
        <StarRating rating={rating} size={16} />
        <p className="mt-1 text-[12px] text-muted">
          {labels.outOf} · {reviewCount.toLocaleString()} {labels.reviews}
        </p>
      </div>

      <div className="flex-1 w-full space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const pct = distribution[star] ?? 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-[12px] text-muted w-4 flex-shrink-0">{star}</span>
              <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full rounded-full bg-warn"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[12px] text-muted w-7 text-right flex-shrink-0">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
