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
 * Gallery/schema/OG image list for a product: its dedicated real photo when
 * one exists, otherwise `count` real photos from the generic saree pool
 * (same source ProductCard uses), and only falling back to the product's
 * own placeholder image set if that pool is somehow empty. This keeps
 * every product's detail-page gallery on local, always-available images
 * instead of depending on placehold.co for the ~28 products that don't
 * have a dedicated photo.
 */
export function resolveProductGalleryImages(product: Product, count = 4): string[] {
  const dedicated = getDedicatedProductImage(product.slug);
  if (dedicated) return [dedicated.src];

  const pooled = getSareeImagesForProduct(product.id, count);
  if (pooled.length > 0) return pooled.map((image) => image.src);

  return product.images;
}
