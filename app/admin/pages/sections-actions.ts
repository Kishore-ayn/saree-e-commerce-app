"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type SectionFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; error: string };

function readSectionFields(formData: FormData): ReadFieldsResult {
  const sectionType = formData.get("section_type");
  if (typeof sectionType !== "string" || !sectionType) {
    return { ok: false, error: "Section type is required." };
  }

  const dataRaw = (formData.get("data") as string) ?? "";
  let data: Record<string, unknown> = {};
  if (dataRaw.trim()) {
    try {
      const parsed = JSON.parse(dataRaw);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return { ok: false, error: "Data must be a JSON object, e.g. {\"heading\": \"...\"}." };
      }
      data = parsed;
    } catch {
      return { ok: false, error: "Data must be valid JSON." };
    }
  }

  const position = formData.get("position");

  return {
    ok: true,
    fields: {
      section_type: sectionType,
      data,
      status: (formData.get("status") as string) || "draft",
      position: position ? Number(position) : 0,
    },
  };
}

export async function createSection(
  pageId: string,
  _state: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await verifySession();
  const parsed = readSectionFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("page_sections")
    .insert({ ...parsed.fields, page_id: pageId });

  if (error) {
    return { error: `Could not create section: ${error.message}` };
  }

  revalidatePath(`/admin/pages/${pageId}/edit`);
  redirect(`/admin/pages/${pageId}/edit`);
}

export async function updateSection(
  id: string,
  pageId: string,
  _state: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await verifySession();
  const parsed = readSectionFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("page_sections").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update section: ${error.message}` };
  }

  revalidatePath(`/admin/pages/${pageId}/edit`);
  redirect(`/admin/pages/${pageId}/edit`);
}

export async function deleteSection(id: string, pageId: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("page_sections").delete().eq("id", id);
  revalidatePath(`/admin/pages/${pageId}/edit`);
}
