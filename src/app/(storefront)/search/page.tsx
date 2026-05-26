import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-8 w-32 rounded-lg bg-line animate-pulse mb-6" />
      <div className="h-12 rounded-xl bg-line animate-pulse mb-8 max-w-[680px]" />
    </div>
  );
}
