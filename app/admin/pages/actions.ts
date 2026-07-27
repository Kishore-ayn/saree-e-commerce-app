"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type PageFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; error: string };

function readPageFields(formData: FormData): ReadFieldsResult {
  const title = formData.get("title");
  const slug = formData.get("slug");

  if (typeof title !== "string" || !title.trim()) return { ok: false, error: "Title is required." };
  if (typeof slug !== "string" || !slug.trim()) return { ok: false, error: "Slug is required." };

  return {
    ok: true,
    fields: {
      title,
      slug,
      template: (formData.get("template") as string) || "standard",
      meta_title: (formData.get("meta_title") as string) || null,
      meta_description: (formData.get("meta_description") as string) || null,
      og_media_id: (formData.get("og_media_id") as string) || null,
      status: (formData.get("status") as string) || "draft",
    },
  };
}

export async function createPage(
  _state: PageFormState,
  formData: FormData
): Promise<PageFormState> {
  const user = await verifySession();
  const parsed = readPageFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .insert({ ...parsed.fields, created_by: user.id, updated_by: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Could not create page: ${error?.message}` };
  }

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${data.id}/edit`);
}

export async function updatePage(
  id: string,
  _state: PageFormState,
  formData: FormData
): Promise<PageFormState> {
  const user = await verifySession();
  const parsed = readPageFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ ...parsed.fields, updated_by: user.id })
    .eq("id", id);

  if (error) {
    return { error: `Could not update page: ${error.message}` };
  }

  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("pages").delete().eq("id", id);
  revalidatePath("/admin/pages");
}
