import { CATEGORY_ITEMS, OCCASION_ITEMS } from "@/data/theme-nav";
import { getThemeImage, type ThemeImageGroup } from "@/lib/theme-images";

export interface MegaMenuLink {
  label: string;
  href: string;
  imageGroup: ThemeImageGroup;
  imageKey: string;
}

const fabricLinks: MegaMenuLink[] = CATEGORY_ITEMS.map((c) => ({
  label: c.label,
  href: c.href,
  imageGroup: "categories",
  imageKey: c.key,
}));

const occasionLinks: MegaMenuLink[] = OCCASION_ITEMS.map((o) => ({
  label: o.label,
  href: o.href,
  imageGroup: "occasions",
  imageKey: o.key,
}));

// Bridal Sarees has its own dedicated fetched photo (public/images/collections);
// the other three reuse category thumbnails already fetched for Task 1 — no
// duplicate fetches for this column.
const collectionLinks: MegaMenuLink[] = [
  { label: "Bridal Sarees", href: "/collections/bridal-sarees", imageGroup: "collections", imageKey: "bridal-sarees" },
  { label: "Sarees Under ₹1000", href: "/collections/sarees-under-1000", imageGroup: "categories", imageKey: "cotton-sarees" },
  { label: "Sarees Under ₹2000", href: "/collections/sarees-under-2000", imageGroup: "categories", imageKey: "georgette-sarees" },
  { label: "Daily Wear Sarees", href: "/collections/daily-wear-sarees", imageGroup: "categories", imageKey: "handloom-sarees" },
];

export const megaMenuColumns: { heading: string; links: MegaMenuLink[] }[] = [
  { heading: "Shop by Category", links: fabricLinks },
  { heading: "Shop by Occasion", links: occasionLinks },
  { heading: "Collections", links: collectionLinks },
];

const FALLBACK_BG: Record<string, string> = {
  "kanchipuram-silk": "7a1f35/f3e9da",
  "banarasi-sarees": "5c1728/d4b876",
  "soft-silk-sarees": "6b1a2e/d4b876",
  "cotton-sarees": "2c4a6e/fbf7f0",
  "handloom-sarees": "8a3a3a/d9cdb0",
  "georgette-sarees": "1f3a6e/d4b876",
  wedding: "7a1f35/d4b876",
  haldi: "c9932e/5c1728",
  mehendi: "3f6b4a/d4b876",
  sangeet: "5b2a7a/d4b876",
  reception: "6b1a2e/d4b876",
  festive: "0e6e6e/d4b876",
  "bridal-sarees": "6b1a2e/d4b876",
};

export function thumbnailFor(link: MegaMenuLink) {
  const [bg, fg] = (FALLBACK_BG[link.imageKey] ?? "7a1f35/f3e9da").split("/");
  return getThemeImage(link.imageGroup, link.imageKey, {
    src: `https://placehold.co/200x260/${bg}/${fg}.png?text=${encodeURIComponent(link.label)}`,
    alt: link.label,
  });
}

export const featuredMenuFallback = {
  src: "https://placehold.co/500x650/b08d3e/2a1a1a.png?text=New+Arrivals",
  alt: "New arrival sarees",
};

export function getFeaturedMenuImage() {
  return getThemeImage("featured", "new-arrivals", featuredMenuFallback);
}
