import { describe, expect, test } from "vitest";
import { searchProducts, searchCollections } from "@/lib/search";
import type { Product, Collection } from "@/lib/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    slug: "test-saree",
    name: "Kanjivaram Bridal Silk",
    fabric: "Kanchipuram Silk",
    collections: ["bridal-sarees"],
    occasions: ["Wedding"],
    colors: ["Red"],
    price: 5000,
    mrp: 6000,
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

function makeCollection(overrides: Partial<Collection> = {}): Collection {
  return {
    slug: "bridal-sarees",
    name: "Bridal Sarees",
    title: "Bridal Sarees",
    metaDescription: "",
    h1: "",
    intro: "",
    seoHeading: "",
    seoContent: [],
    ...overrides,
  };
}

describe("searchProducts", () => {
  const products = [
    makeProduct(),
    makeProduct({ id: "p2", name: "Cotton Daily Wear", fabric: "Cotton", occasions: ["Daily Wear"], colors: ["Blue"], collections: [] }),
  ];

  test("returns nothing for an empty query", () => {
    expect(searchProducts("", products)).toEqual([]);
  });

  test("matches by name, case-insensitively", () => {
    const results = searchProducts("kanjivaram", products);
    expect(results.map((p) => p.id)).toEqual(["p1"]);
  });

  test("matches by fabric, occasion and colour", () => {
    expect(searchProducts("silk", products).map((p) => p.id)).toEqual(["p1"]);
    expect(searchProducts("wedding", products).map((p) => p.id)).toEqual(["p1"]);
    expect(searchProducts("blue", products).map((p) => p.id)).toEqual(["p2"]);
  });

  test("matches by collection slug with hyphens treated as spaces", () => {
    expect(searchProducts("bridal sarees", products).map((p) => p.id)).toEqual(["p1"]);
  });

  test("respects the limit", () => {
    const many = [makeProduct({ id: "a" }), makeProduct({ id: "b" }), makeProduct({ id: "c" })];
    expect(searchProducts("silk", many, 2)).toHaveLength(2);
  });
});

describe("searchCollections", () => {
  const collections = [makeCollection(), makeCollection({ slug: "cotton-sarees", name: "Cotton Sarees" })];

  test("returns nothing for an empty query", () => {
    expect(searchCollections("", collections)).toEqual([]);
  });

  test("matches by name, case-insensitively", () => {
    expect(searchCollections("BRIDAL", collections).map((c) => c.slug)).toEqual(["bridal-sarees"]);
  });
});
