function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-line ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-paper overflow-hidden">
      <SkeletonBox className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-5 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
        <SkeletonBox className="h-4 w-4/6" />
        <div className="pt-4 border-t border-line flex justify-between">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8 space-y-3">
        <SkeletonBox className="h-10 w-32" />
        <SkeletonBox className="h-4 w-72" />
      </div>
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
