import { createStaticClient } from "@/lib/cms/supabase/static";
import type { Collection } from "@/lib/types";

// ---------------------------------------------------------------------
// Public-facing (Phase 11) — return shapes match lib/types.ts Collection
// exactly.
// ---------------------------------------------------------------------

export type RawCollectionRow = {
  slug: string;
  name: string;
  title: string;
  meta_description: string | null;
  h1: string | null;
  intro: string | null;
  seo_heading: string | null;
  seo_content: string[] | null;
  related_area_label: string | null;
  areas: { slug: string } | null;
  collection_related_collections: { collections: { slug: string } | null }[] | null;
};

export function mapCollectionRow(row: RawCollectionRow): Collection {
  const relatedCollections = (row.collection_related_collections ?? [])
    .map((rc) => rc.collections?.slug)
    .filter((slug): slug is string => Boolean(slug));

  return {
    slug: row.slug,
    name: row.name,
    title: row.title,
    metaDescription: row.meta_description ?? "",
    h1: row.h1 ?? row.title,
    intro: row.intro ?? "",
    seoHeading: row.seo_heading ?? "",
    seoContent: row.seo_content ?? [],
    relatedCollections: relatedCollections.length > 0 ? relatedCollections : undefined,
    relatedAreaLink:
      row.areas && row.related_area_label
        ? { label: row.related_area_label, href: `/saree-shop/${row.areas.slug}` }
        : undefined,
  };
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "*, areas!related_area_id(slug), collection_related_collections!collection_id(collections!related_collection_id(slug))"
    )
    .eq("status", "published")
    .order("position", { ascending: true });

  if (error) {
    return [];
  }

  if (!data) {
    return [];
  }

  return (data as unknown as RawCollectionRow[]).map(mapCollectionRow);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "*, areas!related_area_id(slug), collection_related_collections!collection_id(collections!related_collection_id(slug))"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;

  return mapCollectionRow(data as unknown as RawCollectionRow);
}