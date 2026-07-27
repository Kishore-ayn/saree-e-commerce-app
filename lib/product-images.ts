import productsManifest from "@/public/images/products/manifest.json";
import type { Product } from "@/lib/types";
import { getSareeImagesForProduct } from "@/lib/sarees-manifest";

export interface ProductImageMeta {
  alt_description: string;
  photographer: string;
  photographer_url: string | null;
}

const manifest: Record<string, ProductImageMeta> = productsManifest;

export interface ProductImage {
  src: string;
  alt: string;
  photographer: string;
  photographer_url: string | null;
}

/**
 * Looks up a dedicated Unsplash photo for a specific product by slug
 * (populated by scripts/fetch-theme-images.js's PRODUCT_ITEMS group).
 * Most products don't have one of these — they fall back to the generic
 * saree photo pool via getSareeImagesForProduct — so this returns null
 * rather than a placeholder when there's no dedicated entry.
 */
export function getDedicatedProductImage(slug: string): ProductImage | null {
  const filename = `${slug}.webp`;
  const meta = manifest[filename];
  if (!meta) return null;

  return {
    src: `/images/products/${filename}`,
    alt: meta.alt_description,
    photographer: meta.photographer,
    photographer_url: meta.photographer_url,
  };
}

/**
 * Gallery/schema/OG image list for a product: CMS-managed images
 * (product.images, set via the admin Media Library) take priority when
 * present, since that's the whole point of the CMS's product image
 * picker. Falls back to a dedicated real photo, then the generic saree
 * pool (same source ProductCard uses), for products that haven't had
 * images assigned through the CMS yet.
 */
export function resolveProductGalleryImages(product: Product, count = 4): string[] {
  if (product.images.length > 0) return product.images;

  const dedicated = getDedicatedProductImage(product.slug);
  if (dedicated) return [dedicated.src];

  const pooled = getSareeImagesForProduct(product.id, count);
  if (pooled.length > 0) return pooled.map((image) => image.src);

  return product.images;
}
