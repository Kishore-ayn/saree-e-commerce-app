/**
 * Shared category/occasion nav data, driving the homepage "Shop by Category"
 * / "Shop by Occasion" sections and the header mega-menu, so all three stay
 * in sync and reuse the same fetched Unsplash images (see lib/theme-images.ts
 * and scripts/fetch-theme-images.js).
 */

export interface CategoryNavItem {
  key: string;
  label: string;
  href: string;
}

export interface OccasionNavItem extends CategoryNavItem {
  subtitle: string;
}

export const CATEGORY_ITEMS: CategoryNavItem[] = [
  { key: "kanchipuram-silk", label: "Kanchipuram Silk", href: "/collections/kanchipuram-silk-sarees" },
  { key: "banarasi-sarees", label: "Banarasi Sarees", href: "/collections/banarasi-sarees" },
  { key: "soft-silk-sarees", label: "Soft Silk Sarees", href: "/collections/soft-silk-sarees" },
  { key: "cotton-sarees", label: "Cotton Sarees", href: "/collections/cotton-sarees" },
  { key: "handloom-sarees", label: "Handloom Sarees", href: "/collections/handloom-sarees" },
  { key: "georgette-sarees", label: "Georgette Sarees", href: "/collections/georgette-sarees" },
];

export const OCCASION_ITEMS: OccasionNavItem[] = [
  { key: "wedding", label: "Wedding", subtitle: "For your biggest day", href: "/collections/wedding-sarees" },
  { key: "haldi", label: "Haldi", subtitle: "Bright beginnings, golden hues", href: "/collections/festive-sarees" },
  { key: "mehendi", label: "Mehendi", subtitle: "Where celebrations begin", href: "/collections/fancy-sarees" },
  { key: "sangeet", label: "Sangeet", subtitle: "Dance the night in style", href: "/collections/party-wear-sarees" },
  {
    key: "reception",
    label: "Reception",
    subtitle: "Make your grand entrance",
    href: "/collections/reception-sarees",
  },
  { key: "festive", label: "Festive", subtitle: "Celebrate in style", href: "/collections/festive-sarees" },
];
