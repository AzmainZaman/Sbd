import Link from "next/link";
import { Button } from "@/components/ui/Button";

const labels = {
  eyebrow: "COMING SOON",
  heading: "The Traveler Portal",
  sub: "Earn by bringing packages on your next trip abroad. The traveler programme is currently in development and will launch in Phase 2.",
  back: "Back to shop",
};

export default function TravelerPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-[480px]">
        <span className="font-mono text-[12px] text-muted tracking-widest">{labels.eyebrow}</span>
        <h1 className="mt-3 text-[36px] font-semibold text-ink">{labels.heading}</h1>
        <p className="mt-4 text-[15px] text-muted leading-relaxed">{labels.sub}</p>
        <Link href="/" className="inline-block mt-8">
          <Button variant="ghost" size="md">{labels.back}</Button>
        </Link>
      </div>
    </div>
  );
}
