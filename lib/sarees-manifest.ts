import manifestData from "@/public/images/sarees/manifest.json";

export interface SareeImageMeta {
  alt_description: string;
  photographer: string;
  photographer_url: string | null;
}

export const sareesManifest: Record<string, SareeImageMeta> = manifestData;

const filenames = Object.keys(sareesManifest).sort();

/** Simple deterministic string hash so a given product always maps to the same photos. */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface SareeImage {
  src: string;
  alt: string;
}

/** Deterministically picks `count` distinct photos from the Unsplash manifest for a given product id. */
export function getSareeImagesForProduct(productId: string, count = 2): SareeImage[] {
  if (filenames.length === 0) return [];

  const take = Math.min(count, filenames.length);
  const startIndex = hashString(productId) % filenames.length;
  const images: SareeImage[] = [];

  for (let i = 0; i < take; i++) {
    const filename = filenames[(startIndex + i) % filenames.length];
    const meta = sareesManifest[filename];
    images.push({ src: `/images/sarees/${filename}`, alt: meta.alt_description });
  }

  return images;
}
