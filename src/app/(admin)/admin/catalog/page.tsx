import { getAllProducts } from "@/actions/admin/products";
import { Chip } from "@/components/ui/Chip";
import { formatBDT } from "@/lib/utils";
import type { ComponentProps } from "react";

type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;

const labels = {
  heading: "Catalog",
  sub: "All products in the SBD catalog.",
  colProduct: "Product",
  colBrand: "Brand",
  colCategory: "Category",
  colOrigin: "Origin",
  colPrice: "Price",
  colStatus: "Status",
  colStock: "Stock",
  colActive: "Active",
};

const statusConfig: Record<string, { label: string; variant: ChipVariant }> = {
  "in-stock": { label: "In stock", variant: "stock" },
  "pre-order": { label: "Pre-order", variant: "pre" },
  "out-of-stock": { label: "Out of stock", variant: "line" },
};

export default async function AdminCatalogPage() {
  const products = await getAllProducts();

  const sorted = [...products].sort((a, b) => {
    const order = { "in-stock": 0, "pre-order": 1, "out-of-stock": 2 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  return (
    <div className="px-6 py-8">
      <h1 className="text-[20px] font-semibold text-ink mb-1">{labels.heading}</h1>
      <p className="text-[13px] text-muted mb-6">
        {labels.sub}{" "}
        <span className="text-ink font-medium">{products.length} products</span>
      </p>

      <div className="rounded-xl border border-line bg-paper overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-line bg-bg">
              {[
                labels.colProduct,
                labels.colBrand,
                labels.colCategory,
                labels.colOrigin,
                labels.colPrice,
                labels.colStatus,
                labels.colStock,
                labels.colActive,
              ].map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-widest whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((product, i) => {
              const config = statusConfig[product.status] ?? {
                label: product.status,
                variant: "default" as ChipVariant,
              };
              const isLast = i === sorted.length - 1;
              const thumb =
                product.images.length > 0 ? product.images[0] : product.hero;
              const isUrl = thumb.startsWith("http");

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-bg transition-colors ${isLast ? "" : "border-b border-line"}`}
                >
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 overflow-hidden"
                        style={!isUrl ? { background: thumb } : undefined}
                      >
                        {isUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-ink font-medium truncate max-w-[200px]">
                          {product.name}
                        </p>
                        <p className="font-mono text-[11px] text-muted">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{product.brand}</td>
                  <td className="px-4 py-3 text-muted capitalize">{product.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[12px] text-muted bg-bg px-2 py-0.5 rounded">
                      {product.originCountry}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-mono text-ink">{formatBDT(product.priceBDT)}</p>
                    {product.priceUSD != null && (
                      <p className="font-mono text-[11px] text-muted">${product.priceUSD}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Chip variant={config.variant}>{config.label}</Chip>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted">
                    {product.stock != null ? product.stock : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: product.isActive ? "var(--ok)" : "var(--line)",
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
