import { revalidatePath } from "next/cache";

/**
 * Revalidates every public page that reads CMS content (Phase 11's wiring:
 * products, collections, areas, blog — the only content types the public
 * site currently consumes, per docs/architecture.md section 1). Call this
 * from every products/collections/areas/blog admin action after a write.
 *
 * Deliberately broad rather than computing the minimal affected path set
 * per edit (e.g. resolving exactly which collection/area pages reference a
 * given product) — the cross-references between these four content types
 * are extensive enough that a precise approach would need extra queries
 * for marginal benefit. revalidatePath only marks paths stale; it doesn't
 * eagerly regenerate them, so calling it broadly is cheap.
 *
 * Testimonials, FAQs, pages/sections, forms, navigation, and site_settings
 * are intentionally excluded — no public page reads them yet, so
 * revalidating for those content types would be a no-op.
 */
export function revalidatePublicSite() {
  revalidatePath("/");
  revalidatePath("/wishlist");
  revalidatePath("/sitemap.xml");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/saree-shop/[area]", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");
}
