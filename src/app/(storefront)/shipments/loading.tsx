function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-line ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function ShipmentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-6 w-36" />
        </div>
        <SkeletonBox className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex gap-6 mb-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonBox className="h-2.5 w-14" />
            <SkeletonBox className="h-4 w-20" />
          </div>
        ))}
      </div>
      <SkeletonBox className="h-3 w-full" />
    </div>
  );
}

export default function ShipmentsLoading() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8 space-y-3">
        <SkeletonBox className="h-10 w-64" />
        <SkeletonBox className="h-4 w-80" />
      </div>
      <SkeletonBox className="h-11 w-56 rounded-xl mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <ShipmentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
