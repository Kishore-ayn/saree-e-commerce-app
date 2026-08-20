import { createClient } from "@/lib/cms/supabase/server";
import { createStaticClient } from "@/lib/cms/supabase/static";
import type { Area } from "@/lib/types";

export type AreaAdminListItem = {
  id: string;
  slug: string;
  name: string;
  status: "draft" | "published";
  position: number;
};

export async function listAreasAdmin(): Promise<AreaAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .select("id, slug, name, status, position")
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data;
}

export type AreaAdminDetail = {
  id: string;
  slug: string;
  name: string;
  title: string;
  metaDescription: string | null;
  h1: string | null;
  intro: string | null;
  landmarks: string[];
  status: "draft" | "published";
  position: number;
  collectionIds: string[];
};

export async function getAreaAdmin(id: string): Promise<AreaAdminDetail | null> {
  const supabase = await createClient();

  const { data: area, error } = await supabase
    .from("areas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !area) return null;

  const { data: collectionLinks } = await supabase
    .from("area_collections")
    .select("collection_id")
    .eq("area_id", id);

  return {
    id: area.id,
    slug: area.slug,
    name: area.name,
    title: area.title,
    metaDescription: area.meta_description,
    h1: area.h1,
    intro: area.intro,
    landmarks: area.landmarks ?? [],
    status: area.status,
    position: area.position,
    collectionIds: (collectionLinks ?? []).map((row) => row.collection_id),
  };
}

// ---------------------------------------------------------------------
// Public-facing (Phase 11) — return shapes match lib/types.ts Area
// exactly. Published rows only.
//
// Note: Area.intro is string[] in lib/types.ts, but areas.intro is a
// plain text column (a Phase 3 simplification — see docs/database-schema.md).
// Split on blank lines to approximate the original paragraph-array shape.
// ---------------------------------------------------------------------

type RawAreaRow = {
  id: string;
  slug: string;
  name: string;
  title: string;
  meta_description: string | null;
  h1: string | null;
  intro: string | null;
  landmarks: string[] | null;
  area_collections: { collections: { slug: string } | null }[] | null;
};

async function mapAreaRow(
  supabase: ReturnType<typeof createStaticClient>,
  row: RawAreaRow
): Promise<Area> {
  const relevantCollections = (row.area_collections ?? [])
    .map((ac) => ac.collections?.slug)
    .filter((slug): slug is string => Boolean(slug));

  const { data: faqRows } = await supabase
    .from("faqs")
    .select("question, content")
    .eq("area_id", row.id)
    .eq("status", "published")
    .order("position", { ascending: true });

  return {
    slug: row.slug,
    name: row.name,
    title: row.title,
    metaDescription: row.meta_description ?? "",
    h1: row.h1 ?? row.title,
    intro: (row.intro ?? "").split(/\n\s*\n/).filter(Boolean),
    landmarks: row.landmarks ?? [],
    relevantCollections,
    faqs: (faqRows ?? []).map((f) => ({ question: f.question, answer: f.content })),
  };
}

export async function getAreas(): Promise<Area[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("areas")
    .select("*, area_collections(collections(slug))")
    .eq("status", "published")
    .order("position", { ascending: true });

  if (error || !data) return [];
  return Promise.all((data as unknown as RawAreaRow[]).map((row) => mapAreaRow(supabase, row)));
}

export async function getAreaBySlug(slug: string): Promise<Area | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("areas")
    .select("*, area_collections(collections(slug))")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;

  return mapAreaRow(supabase, data as unknown as RawAreaRow);
}
