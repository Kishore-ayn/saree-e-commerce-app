import { describe, expect, test } from "vitest";
import { mapProductRow, type RawProductRow } from "@/lib/cms/products";
import type { createStaticClient } from "@/lib/cms/supabase/static";

// getPublicUrl is a pure string-construction call (no network request), so a
// minimal stub reproduces real Supabase client behavior exactly for this test.
const fakeSupabase = {
  storage: {
    from: (bucket: string) => ({
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://fake.supabase.co/storage/v1/object/public/${bucket}/${path}` },
      }),
    }),
  },
} as unknown as ReturnType<typeof createStaticClient>;

function makeRow(overrides: Partial<RawProductRow> = {}): RawProductRow {
  return {
    id: "id-1",
    slug: "test-saree",
    name: "Test Saree",
    sku: "SKU1",
    description: "Short description",
    long_description: "Long description",
    price: 5000,
    compare_at_price: 6000,
    attributes: {},
    rating: 4.5,
    review_count: 10,
    in_stock: true,
    is_new_arrival: false,
    is_bestseller: false,
    product_collections: [],
    product_media: [],
    ...overrides,
  };
}

describe("mapProductRow", () => {
  test("maps core fields directly", () => {
    const product = mapProductRow(fakeSupabase, makeRow());
    expect(product.id).toBe("id-1");
    expect(product.slug).toBe("test-saree");
    expect(product.price).toBe(5000);
    expect(product.mrp).toBe(6000);
  });

  test("falls back mrp to price when compare_at_price is null", () => {
    const product = mapProductRow(fakeSupabase, makeRow({ compare_at_price: null }));
    expect(product.mrp).toBe(product.price);
  });

  test("extracts business-specific fields from attributes jsonb", () => {
    const product = mapProductRow(
      fakeSupabase,
      makeRow({
        attributes: {
          fabric: "Banarasi Silk",
          occasions: ["Wedding", "Festive"],
          colors: ["Red", "Gold"],
          blousePiece: true,
          length: "6.3 metres",
          care: "Dry clean only",
        },
      })
    );
    expect(product.fabric).toBe("Banarasi Silk");
    expect(product.occasions).toEqual(["Wedding", "Festive"]);
    expect(product.colors).toEqual(["Red", "Gold"]);
    expect(product.blousePiece).toBe(true);
    expect(product.length).toBe("6.3 metres");
    expect(product.care).toBe("Dry clean only");
  });

  test("defaults fabric when attributes.fabric is missing, rather than crashing", () => {
    const product = mapProductRow(fakeSupabase, makeRow({ attributes: {} }));
    expect(product.fabric).toBe("Cotton");
  });

  test("maps joined collection slugs, dropping any null entries", () => {
    const product = mapProductRow(
      fakeSupabase,
      makeRow({
        product_collections: [
          { collections: { slug: "bridal-sarees" } },
          { collections: { slug: "wedding-sarees" } },
          { collections: null },
        ],
      })
    );
    expect(product.collections).toEqual(["bridal-sarees", "wedding-sarees"]);
  });

  test("resolves media into ordered public URLs", () => {
    const product = mapProductRow(
      fakeSupabase,
      makeRow({
        product_media: [
          { position: 1, media: { storage_path: "image/second.jpg" } },
          { position: 0, media: { storage_path: "image/first.jpg" } },
        ],
      })
    );
    expect(product.images).toEqual([
      "https://fake.supabase.co/storage/v1/object/public/media/image/first.jpg",
      "https://fake.supabase.co/storage/v1/object/public/media/image/second.jpg",
    ]);
  });
});
