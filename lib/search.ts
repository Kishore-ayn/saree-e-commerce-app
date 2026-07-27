import type { Product, Collection } from "@/lib/types";

/** Case-insensitive substring match across name, fabric, occasion, colour and collection tags. */
export function searchProducts(query: string, products: Product[], limit = 6): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.occasions.some((o) => o.toLowerCase().includes(q)) ||
        p.colors.some((c) => c.toLowerCase().includes(q)) ||
        p.collections.some((c) => c.replace(/-/g, " ").includes(q))
    )
    .slice(0, limit);
}

export function searchCollections(query: string, collections: Collection[], limit = 4): Collection[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return collections.filter((c) => c.name.toLowerCase().includes(q)).slice(0, limit);
}

export const POPULAR_SEARCHES = [
  { label: "Silk Sarees", href: "/collections/soft-silk-sarees" },
  { label: "Wedding Sarees", href: "/collections/wedding-sarees" },
  { label: "Cotton Sarees", href: "/collections/cotton-sarees" },
  { label: "Bridal Sarees", href: "/collections/bridal-sarees" },
  { label: "Under ₹1000", href: "/collections/sarees-under-1000" },
] as const;
