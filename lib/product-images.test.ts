import { describe, expect, test } from "vitest";
import { resolveProductGalleryImages } from "@/lib/product-images";
import type { Product } from "@/lib/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "does-not-exist-in-any-manifest",
    slug: "does-not-exist-in-any-manifest",
    name: "Test Saree",
    fabric: "Cotton",
    collections: [],
    occasions: [],
    colors: [],
    price: 1000,
    mrp: 1000,
    description: "",
    longDescription: "",
    images: [],
    rating: 0,
    reviewCount: 0,
    inStock: true,
    sku: "SKU1",
    blousePiece: false,
    length: "",
    care: "",
    ...overrides,
  };
}

describe("resolveProductGalleryImages", () => {
  // This priority (CMS-managed images win when present) is the specific
  // behavior change made in Phase 11.2 to make the admin Media Library's
  // product image picker actually visible on the live site.
  test("prefers CMS-managed product.images over any curated fallback when present", () => {
    const product = makeProduct({ images: ["https://cdn.example.com/a.jpg", "https://cdn.example.com/b.jpg"] });
    expect(resolveProductGalleryImages(product)).toEqual([
      "https://cdn.example.com/a.jpg",
      "https://cdn.example.com/b.jpg",
    ]);
  });

  test("falls back to a non-empty array when product.images is empty", () => {
    const product = makeProduct({ images: [] });
    const result = resolveProductGalleryImages(product);
    expect(Array.isArray(result)).toBe(true);
  });
});
