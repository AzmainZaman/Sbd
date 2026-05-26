import type React from "react";

function SkeletonBox({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-line ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export default function BlogPostLoading() {
  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <SkeletonBox className="h-4 w-28 mb-6" />
      <SkeletonBox className="h-52 sm:h-72 w-full rounded-2xl mb-6" />
      <SkeletonBox className="h-3 w-40 mb-4" />
      <SkeletonBox className="h-9 w-full mb-2" />
      <SkeletonBox className="h-9 w-4/5 mb-6" />
      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-line">
        <SkeletonBox className="h-8 w-8 rounded-full" />
        <div className="space-y-1.5">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-3">
        {[100, 90, 95, 70, 85, 80, 60, 88].map((w, i) => (
          <SkeletonBox key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
