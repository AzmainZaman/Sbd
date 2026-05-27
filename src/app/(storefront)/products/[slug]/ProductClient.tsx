"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { FlagBadge } from "@/components/ui/FlagBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ETABlock } from "@/components/product/ETABlock";
import { VariantSelector } from "@/components/product/VariantSelector";
import { TrustBadges } from "@/components/product/TrustBadges";
import { ReviewSummary } from "@/components/product/ReviewSummary";
import { ReviewList } from "@/components/product/ReviewList";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { StarRating } from "@/components/ui/Star";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { formatBDT, formatDate } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import type { Shipment } from "@/types/shipment";

type Props = {
  product: Product;
  shipment: Shipment | null;
  related: Product[];
};

export function ProductClient({ product, shipment, related }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants?.[0]?.available ? product.variants[0].id : null
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const variantObj = product.variants?.find((v) => v.id === selectedVariant);
  const effectivePrice = product.priceBDT + (variantObj?.priceDelta ?? 0);
  const isPreOrder = product.status === "pre-order";

  function handleAdd() {
    addItem({
      productId: product.id,
      productName: product.name,
      variant: variantObj?.name,
      priceBDT: effectivePrice,
      priceUSD: product.priceUSD,
      quantity: qty,
      type: isPreOrder ? "pre-order" : "in-stock",
      shipmentId: product.shipmentId,
      eta: product.eta,
      hero: product.hero,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="hidden lg:flex items-center gap-2 text-[13px] text-muted mb-8">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category}`}
          className="hover:text-ink transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left — gallery */}
        <ProductGallery images={product.images} alt={product.name} hero={product.hero} />

        {/* Right — info */}
        <div className="flex flex-col gap-5">
          {/* Brand + flag */}
          <div className="flex items-center gap-2">
            <FlagBadge country={product.originCountry} size={18} />
            <span className="text-[13px] text-muted">{product.brand}</span>
            {product.sourceRetailer && (
              <span className="text-[13px] text-muted">· {product.sourceRetailer}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-[24px] lg:text-[30px] font-semibold text-ink leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} size={15} />
              <span className="text-[13px] text-muted">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          )}

          {/* Status chip */}
          <div>
            {isPreOrder ? (
              <Chip variant="pre">
                Pre-order · ETA {product.eta ? formatDate(product.eta, "short") : "TBC"}
              </Chip>
            ) : (
              <Chip variant="stock">
                In stock{product.stock !== undefined ? ` · ${product.stock} available` : ""}
              </Chip>
            )}
          </div>

          {/* Price */}
          <div>
            <p className="text-[32px] font-semibold text-ink">{formatBDT(effectivePrice)}</p>
            {product.priceUSD && (
              <p className="text-[14px] font-mono text-muted">${product.priceUSD} USD</p>
            )}
          </div>

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
              label={isPreOrder ? "Select option" : "Size / Option"}
            />
          )}

          {/* Qty + CTA */}
          <div className="flex items-center gap-3">
            <QuantityInput value={qty} onChange={setQty} min={1} max={10} />
            <Button
              variant={isPreOrder ? "accent" : "primary"}
              size="lg"
              className="flex-1"
              onClick={handleAdd}
              disabled={product.variants && product.variants.length > 0 && !selectedVariant}
            >
              {added ? "Added ✓" : isPreOrder ? "Pre-order now" : "Add to cart"}
            </Button>
          </div>

          {/* ETA block — pre-order only */}
          {isPreOrder && shipment && <ETABlock shipment={shipment} eta={product.eta!} />}

          {/* Description */}
          <div className="border-t border-line pt-5">
            <h3 className="text-[14px] font-semibold text-ink mb-2">About this product</h3>
            <p className="text-[14px] text-muted leading-relaxed">{product.description}</p>
          </div>

          {/* Trust badges */}
          <TrustBadges />
        </div>
      </div>

      {/* Reviews section */}
      {product.reviewCount > 0 && (
        <div className="mt-16 border-t border-line pt-12">
          <ReviewSummary rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      )}
      <div className="mt-16 border-t border-line pt-12">
        <ReviewList />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16 border-t border-line pt-12">
          <RelatedProducts products={related} />
        </div>
      )}
    </div>
  );
}
