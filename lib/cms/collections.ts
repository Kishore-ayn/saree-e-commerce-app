import { createClient } from "@/lib/cms/supabase/server";
import { createStaticClient } from "@/lib/cms/supabase/static";
import type { Collection } from "@/lib/types";

export type CollectionAdminListItem = {
  id: string;
  slug: string;
  name: string;
  status: "draft" | "published";
  position: number;
};

export async function listCollectionsAdmin(): Promise<CollectionAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, name, status, position")
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data;
}

export type CollectionAdminDetail = {
  id: string;
  slug: string;
  name: string;
  title: string;
  metaDescription: string | null;
  h1: string | null;
  intro: string | null;
  seoHeading: string | null;
  seoContent: string[];
  imageMediaId: string | null;
  relatedAreaId: string | null;
  relatedAreaLabel: string | null;
  status: "draft" | "published";
  position: number;
  relatedCollectionIds: string[];
};

export async function getCollectionAdmin(
  id: string
): Promise<CollectionAdminDetail | null> {
  const supabase = await createClient();

  const { data: collection, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !collection) return null;

  const { data: relatedLinks } = await supabase
    .from("collection_related_collections")
    .select("related_collection_id")
    .eq("collection_id", id);

  return {
    id: collection.id,
    slug: collection.slug,
    name: collection.name,
    title: collection.title,
    metaDescription: collection.meta_description,
    h1: collection.h1,
    intro: collection.intro,
    seoHeading: collection.seo_heading,
    seoContent: collection.seo_content ?? [],
    imageMediaId: collection.image_media_id,
    relatedAreaId: collection.related_area_id,
    relatedAreaLabel: collection.related_area_label,
    status: collection.status,
    position: collection.position,
    relatedCollectionIds: (relatedLinks ?? []).map((row) => row.related_collection_id),
  };
}

export type AreaPickerItem = { id: string; name: string };

export async function listAreasForPicker(): Promise<AreaPickerItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("areas").select("id, name").order("name");
  if (error || !data) return [];
  return data;
}

export type CollectionPickerItem = { id: string; name: string };

export async function listCollectionsForRelatedPicker(
  excludeId?: string
): Promise<CollectionPickerItem[]> {
  const supabase = await createClient();
  let query = supabase.from("collections").select("id, name").order("name");
  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

// ---------------------------------------------------------------------
// Public-facing (Phase 11) — return shapes match lib/types.ts Collection
// exactly. Published rows only.
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
      "*, areas(slug), collection_related_collections(collections:related_collection_id(slug))"
    )
    .eq("status", "published")
    .order("position", { ascending: true });

  if (error || !data) return [];
  return (data as unknown as RawCollectionRow[]).map(mapCollectionRow);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------
// Dashboard Statistics (Phase 12) — efficient count functions for admin overview
// ---------------------------------------------------------------------

export async function countCollections(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("collections")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}

export async function countCollectionsByStatus(status: "draft" | "published"): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("collections")
    .select("*", { count: "exact", head: true })
    .eq("status", status);

  if (error) return 0;
  return count ?? 0;
}
