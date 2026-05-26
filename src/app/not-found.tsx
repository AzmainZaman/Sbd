import Link from "next/link";
import { Button } from "@/components/ui/Button";

const labels = {
  code: "404",
  heading: "Page not found",
  sub: "The page you're looking for doesn't exist or may have moved.",
  home: "Back to shop",
  track: "Track an order",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-[440px]">
        <span
          className="font-mono text-[64px] font-semibold leading-none"
          style={{ color: "var(--line)" }}
          aria-hidden="true"
        >
          {labels.code}
        </span>
        <h1 className="mt-4 text-[32px] font-semibold text-ink">{labels.heading}</h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">{labels.sub}</p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/">
            <Button variant="primary" size="md">{labels.home}</Button>
          </Link>
          <Link href="/track">
            <Button variant="ghost" size="md">{labels.track}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
