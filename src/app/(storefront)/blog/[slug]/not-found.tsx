import Link from "next/link";
import { Button } from "@/components/ui/Button";

const labels = {
  heading: "Article not found",
  sub: "This article may have moved or been removed.",
  back: "Browse all articles",
};

export default function BlogPostNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-[400px]">
        <h1 className="text-[28px] font-semibold text-ink">{labels.heading}</h1>
        <p className="mt-3 text-[14px] text-muted leading-relaxed">{labels.sub}</p>
        <Link href="/blog" className="inline-block mt-6">
          <Button variant="ghost" size="md">{labels.back}</Button>
        </Link>
      </div>
    </div>
  );
}
