"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";
import { revalidatePublicSite } from "@/lib/cms/revalidate-public";

export type AreaFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown>; collectionIds: string[] }
  | { ok: false; error: string };

function readAreaFields(formData: FormData): ReadFieldsResult {
  const name = formData.get("name");
  const slug = formData.get("slug");
  const title = formData.get("title");

  if (typeof name !== "string" || !name.trim()) return { ok: false, error: "Name is required." };
  if (typeof slug !== "string" || !slug.trim()) return { ok: false, error: "Slug is required." };
  if (typeof title !== "string" || !title.trim()) return { ok: false, error: "Title is required." };

  const landmarksRaw = (formData.get("landmarks") as string) ?? "";
  const landmarks = landmarksRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
      landmarks,
      status: (formData.get("status") as string) || "draft",
      position: position ? Number(position) : 0,
    },
    collectionIds: formData.getAll("collections") as string[],
  };
}

async function syncAreaCollections(
  supabase: Awaited<ReturnType<typeof createClient>>,
  areaId: string,
  collectionIds: string[]
) {
  await supabase.from("area_collections").delete().eq("area_id", areaId);
  if (collectionIds.length > 0) {
    await supabase.from("area_collections").insert(
      collectionIds.map((collection_id) => ({ area_id: areaId, collection_id }))
    );
  }
}

export async function createArea(
  _state: AreaFormState,
  formData: FormData
): Promise<AreaFormState> {
  await verifySession();
  const parsed = readAreaFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .insert(parsed.fields)
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Could not create area: ${error?.message}` };
  }

  await syncAreaCollections(supabase, data.id, parsed.collectionIds);

  revalidatePath("/admin/areas");
  revalidatePublicSite();
  redirect("/admin/areas");
}

export async function updateArea(
  id: string,
  _state: AreaFormState,
  formData: FormData
): Promise<AreaFormState> {
  await verifySession();
  const parsed = readAreaFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("areas").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update area: ${error.message}` };
  }

  await syncAreaCollections(supabase, id, parsed.collectionIds);

  revalidatePath("/admin/areas");
  revalidatePublicSite();
  redirect("/admin/areas");
}

export async function deleteArea(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("areas").delete().eq("id", id);
  revalidatePath("/admin/areas");
  revalidatePublicSite();
}
