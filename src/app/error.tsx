"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const labels = {
  heading: "Something went wrong",
  sub: "An unexpected error occurred. Try refreshing the page.",
  retry: "Try again",
  home: "Back to home",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-[420px]">
        <span className="font-mono text-[11px] text-muted tracking-widest uppercase">
          Error
        </span>
        <h1 className="mt-3 text-[32px] font-semibold text-ink">{labels.heading}</h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">{labels.sub}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={reset}>
            {labels.retry}
          </Button>
          <Link href="/">
            <Button variant="ghost" size="md">
              {labels.home}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
