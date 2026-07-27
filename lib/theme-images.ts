import categoriesManifest from "@/public/images/categories/manifest.json";
import occasionsManifest from "@/public/images/occasions/manifest.json";
import featuredManifest from "@/public/images/featured/manifest.json";
import collectionsManifest from "@/public/images/collections/manifest.json";
import heroManifest from "@/public/images/hero/manifest.json";

export interface ThemeImageMeta {
  alt_description: string;
  photographer: string;
  photographer_url: string | null;
}

export type ThemeImageGroup = "categories" | "occasions" | "featured" | "collections" | "hero";

const manifests: Record<ThemeImageGroup, Record<string, ThemeImageMeta>> = {
  categories: categoriesManifest,
  occasions: occasionsManifest,
  featured: featuredManifest,
  collections: collectionsManifest,
  hero: heroManifest,
};

export interface ThemeImage {
  src: string;
  alt: string;
  photographer?: string;
  photographer_url?: string | null;
}

/**
 * Looks up `${key}.webp` in the given manifest group (populated by
 * scripts/fetch-theme-images.js). Falls back to the caller-supplied
 * placeholder when that entry hasn't been fetched yet — e.g. the script
 * hasn't been run, or an Unsplash rate limit left a gap — so the UI never
 * breaks on a missing photo.
 */
export function getThemeImage(
  group: ThemeImageGroup,
  key: string,
  fallback: { src: string; alt: string }
): ThemeImage {
  const filename = `${key}.webp`;
  const meta = manifests[group][filename];
  if (!meta) return fallback;

  return {
    src: `/images/${group}/${filename}`,
    alt: meta.alt_description,
    photographer: meta.photographer,
    photographer_url: meta.photographer_url,
  };
}
