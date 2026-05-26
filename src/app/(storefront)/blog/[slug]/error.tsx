"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

const labels = {
  heading: "Couldn't load this article",
  sub: "Try refreshing the page or browse all articles.",
  retry: "Try again",
  back: "All articles",
};

export default function BlogPostError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-[400px]">
        <h1 className="text-[28px] font-semibold text-ink">{labels.heading}</h1>
        <p className="mt-3 text-[14px] text-muted leading-relaxed">{labels.sub}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={reset}>
            {labels.retry}
          </Button>
          <Link href="/blog">
            <Button variant="ghost" size="md">{labels.back}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
