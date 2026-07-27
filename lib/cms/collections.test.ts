import { describe, expect, test } from "vitest";
import { mapCollectionRow, type RawCollectionRow } from "@/lib/cms/collections";

function makeRow(overrides: Partial<RawCollectionRow> = {}): RawCollectionRow {
  return {
    slug: "bridal-sarees",
    name: "Bridal Sarees",
    title: "Bridal Sarees | Kishore Sarees",
    meta_description: "Shop bridal sarees.",
    h1: "Bridal Sarees",
    intro: "Our bridal collection.",
    seo_heading: "Why choose our bridal sarees",
    seo_content: ["Paragraph one.", "Paragraph two."],
    related_area_label: null,
    areas: null,
    collection_related_collections: [],
    ...overrides,
  };
}

describe("mapCollectionRow", () => {
  test("maps core fields directly", () => {
    const collection = mapCollectionRow(makeRow());
    expect(collection.slug).toBe("bridal-sarees");
    expect(collection.seoContent).toEqual(["Paragraph one.", "Paragraph two."]);
  });

  test("falls back h1 to title when h1 is null", () => {
    const collection = mapCollectionRow(makeRow({ h1: null }));
    expect(collection.h1).toBe(collection.title);
  });

  test("omits relatedAreaLink when no related area is set", () => {
    const collection = mapCollectionRow(makeRow());
    expect(collection.relatedAreaLink).toBeUndefined();
  });

  test("builds relatedAreaLink href from the joined area's slug", () => {
    const collection = mapCollectionRow(
      makeRow({ areas: { slug: "gajuwaka" }, related_area_label: "Kanchipuram Sarees in Gajuwaka" })
    );
    expect(collection.relatedAreaLink).toEqual({
      label: "Kanchipuram Sarees in Gajuwaka",
      href: "/saree-shop/gajuwaka",
    });
  });

  test("omits relatedCollections when the join list is empty", () => {
    const collection = mapCollectionRow(makeRow({ collection_related_collections: [] }));
    expect(collection.relatedCollections).toBeUndefined();
  });

  test("maps related collection slugs, dropping null entries", () => {
    const collection = mapCollectionRow(
      makeRow({
        collection_related_collections: [
          { collections: { slug: "wedding-sarees" } },
          { collections: null },
        ],
      })
    );
    expect(collection.relatedCollections).toEqual(["wedding-sarees"]);
  });
});
