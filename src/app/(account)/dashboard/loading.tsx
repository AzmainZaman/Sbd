function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-line ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-52 shrink-0 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox key={i} className="h-9 w-full rounded-xl" />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="flex-1 space-y-6">
          <SkeletonBox className="h-7 w-40" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBox key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
          <SkeletonBox className="h-40 rounded-2xl" />
          <SkeletonBox className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
