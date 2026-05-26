"use client";

import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { FlagBadge } from "@/components/ui/FlagBadge";
import { formatBDT, formatDate } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();

  function handleAdd() {
    addItem({
      productId: product.id,
      productName: product.name,
      priceBDT: product.priceBDT,
      priceUSD: product.priceUSD,
      quantity: 1,
      type: product.status === "pre-order" ? "pre-order" : "in-stock",
      shipmentId: product.shipmentId,
      eta: product.eta,
      hero: product.hero,
    });
    openCart();
  }

  return (
    <div className="group flex flex-col bg-paper rounded-2xl border border-line overflow-hidden hover:shadow-md transition-shadow">
      {/* Hero */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] flex-shrink-0">
        <div
          className="absolute inset-0"
          style={{ background: product.hero }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <FlagBadge country={product.originCountry} size={16} />
          <span className="text-[11px] font-medium text-ink bg-paper/90 rounded-full px-2 py-0.5">
            {product.brand}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          {product.status === "in-stock" ? (
            <Chip variant="stock">In stock</Chip>
          ) : (
            <Chip variant="pre">
              Pre-order · ETA {product.eta ? formatDate(product.eta, "short") : "TBC"}
            </Chip>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 text-[14px] font-medium text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[18px] font-semibold text-ink">{formatBDT(product.priceBDT)}</p>
            {product.priceUSD && (
              <p className="text-[12px] font-mono text-muted">${product.priceUSD}</p>
            )}
          </div>
          <Button
            variant={product.status === "pre-order" ? "accent" : "primary"}
            size="sm"
            onClick={handleAdd}
          >
            {product.status === "pre-order" ? "Pre-order" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
