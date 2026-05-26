import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { formatBDT, formatDate } from "@/lib/utils";
import { FlagBadge } from "@/components/ui/FlagBadge";
import type { Product } from "@/types/product";

type RelatedProductsProps = {
  products: Product[];
};

const labels = {
  heading: "You might also like",
  viewAll: "View all",
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[20px] font-semibold text-ink">{labels.heading}</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="flex-shrink-0 w-[200px] rounded-2xl border border-line bg-paper overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="h-[140px]"
              style={{ background: p.hero }}
            />
            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <FlagBadge country={p.originCountry} size={14} />
                <span className="text-[11px] text-muted">{p.brand}</span>
              </div>
              <p className="text-[13px] font-medium text-ink line-clamp-2 leading-snug">{p.name}</p>
              <div className="mt-2 flex items-center justify-between gap-1">
                <p className="text-[14px] font-semibold text-ink">{formatBDT(p.priceBDT)}</p>
                {p.status === "in-stock" ? (
                  <Chip variant="stock">In stock</Chip>
                ) : (
                  <Chip variant="pre">
                    ETA {p.eta ? formatDate(p.eta, "short") : "TBC"}
                  </Chip>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
