import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { formatDate, formatBDT } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { Quote, QuoteStatus } from "@/types/quote";
import type { ComponentProps } from "react";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const statusMap: Record<QuoteStatus, { label: string; variant: ChipVariant }> =
  {
    pending: { label: "Awaiting review", variant: "default" },
    "quote-sent": { label: "Quote ready", variant: "accent" },
    "customer-replied": { label: "Replied", variant: "line" },
    accepted: { label: "Accepted", variant: "stock" },
    declined: { label: "Declined", variant: "line" },
    expired: { label: "Expired", variant: "default" },
  };

type QuoteListItemProps = {
  quote: Quote;
};

export function QuoteListItem({ quote }: QuoteListItemProps) {
  const chip = statusMap[quote.status];

  return (
    <Link
      href={`/quotes/${quote.id}`}
      className="flex items-start gap-4 px-4 py-4 rounded-xl border border-line bg-paper hover:border-muted transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-mono text-[13px] font-medium text-ink">
            {quote.id}
          </p>
          <Chip variant={chip.variant}>{chip.label}</Chip>
        </div>
        <p className="text-[14px] text-ink font-medium truncate">
          {quote.productName}
          {quote.productVariant && (
            <span className="text-muted font-normal"> · {quote.productVariant}</span>
          )}
        </p>
        <p className="text-[12px] text-muted mt-0.5">
          Requested {formatDate(quote.requestedAt, "short")}
          {quote.sourceRetailer && ` · ${quote.sourceRetailer}`}
        </p>
        {quote.totalBDT != null && (
          <p className="text-[13px] font-medium text-ink mt-1">
            {formatBDT(quote.totalBDT)}
          </p>
        )}
        {quote.expiresAt && quote.status === "quote-sent" && (
          <p className="text-[12px] mt-0.5" style={{ color: "var(--warn)" }}>
            Expires {formatDate(quote.expiresAt, "short")}
          </p>
        )}
      </div>
      <Icon
        name="chevron-right"
        size={16}
        className="shrink-0 mt-1 text-muted group-hover:text-ink transition-colors"
      />
    </Link>
  );
}
