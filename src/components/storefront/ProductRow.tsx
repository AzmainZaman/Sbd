import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

type ProductRowProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function ProductRow({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View all",
}: ProductRowProps) {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[28px] lg:text-[32px] font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-1 text-[14px] text-muted">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-[14px] font-medium whitespace-nowrap hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: "var(--accent)" }}
          >
            {viewAllLabel} →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
