"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type CollectionFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown>; relatedCollectionIds: string[] }
  | { ok: false; error: string };

function readCollectionFields(formData: FormData): ReadFieldsResult {
  const name = formData.get("name");
  const slug = formData.get("slug");
  const title = formData.get("title");

  if (typeof name !== "string" || !name.trim()) return { ok: false, error: "Name is required." };
  if (typeof slug !== "string" || !slug.trim()) return { ok: false, error: "Slug is required." };
  if (typeof title !== "string" || !title.trim()) return { ok: false, error: "Title is required." };

  const seoContentRaw = (formData.get("seo_content") as string) ?? "";
  const seoContent = seoContentRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const imageMediaId = (formData.get("image_media_id") as string) || null;
  const relatedAreaId = (formData.get("related_area_id") as string) || null;
  const position = formData.get("position");

  return {
    ok: true,
    fields: {
      name,
      slug,
      title,
      meta_description: (formData.get("meta_description") as string) || null,
      h1: (formData.get("h1") as string) || null,
      intro: (formData.get("intro") as string) || null,
      seo_heading: (formData.get("seo_heading") as string) || null,
      seo_content: seoContent,
      image_media_id: imageMediaId,
      related_area_id: relatedAreaId,
      related_area_label: (formData.get("related_area_label") as string) || null,
      status: (formData.get("status") as string) || "draft",
      position: position ? Number(position) : 0,
    },
    relatedCollectionIds: formData.getAll("related_collections") as string[],
  };
}

async function syncRelatedCollections(
  supabase: Awaited<ReturnType<typeof createClient>>,
  collectionId: string,
  relatedCollectionIds: string[]
) {
  await supabase
    .from("collection_related_collections")
    .delete()
    .eq("collection_id", collectionId);

  const ids = relatedCollectionIds.filter((id) => id !== collectionId);
  if (ids.length > 0) {
    await supabase.from("collection_related_collections").insert(
      ids.map((related_collection_id) => ({
        collection_id: collectionId,
        related_collection_id,
      }))
    );
  }
}

export async function createCollection(
  _state: CollectionFormState,
  formData: FormData
): Promise<CollectionFormState> {
  await verifySession();
  const parsed = readCollectionFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .insert(parsed.fields)
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Could not create collection: ${error?.message}` };
  }

  await syncRelatedCollections(supabase, data.id, parsed.relatedCollectionIds);

  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}

export async function updateCollection(
  id: string,
  _state: CollectionFormState,
  formData: FormData
): Promise<CollectionFormState> {
  await verifySession();
  const parsed = readCollectionFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("collections").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update collection: ${error.message}` };
  }

  await syncRelatedCollections(supabase, id, parsed.relatedCollectionIds);

  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}

export async function deleteCollection(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("collections").delete().eq("id", id);
  revalidatePath("/admin/collections");
}
