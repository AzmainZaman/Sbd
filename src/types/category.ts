import type { ProductCategory } from "./product";

export type Category = {
  slug: ProductCategory;
  label: string;
  productCount: number;
  heroGradient: string;
};
