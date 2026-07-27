"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type NavigationItemFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; error: string };

function readNavigationItemFields(formData: FormData): ReadFieldsResult {
  const label = formData.get("label");
  const href = formData.get("href");

  if (typeof label !== "string" || !label.trim()) return { ok: false, error: "Label is required." };
  if (typeof href !== "string" || !href.trim()) return { ok: false, error: "Link is required." };

  const position = formData.get("position");
  const parentId = (formData.get("parent_id") as string) || null;

  return {
    ok: true,
    fields: {
      label,
      href,
      location: (formData.get("location") as string) || "header",
      parent_id: parentId,
      position: position ? Number(position) : 0,
      open_in_new_tab: formData.get("open_in_new_tab") === "on",
      is_visible: formData.get("is_visible") === "on",
    },
  };
}

export async function createNavigationItem(
  _state: NavigationItemFormState,
  formData: FormData
): Promise<NavigationItemFormState> {
  await verifySession();
  const parsed = readNavigationItemFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("navigation_items").insert(parsed.fields);

  if (error) {
    return { error: `Could not create navigation item: ${error.message}` };
  }

  revalidatePath("/admin/navigation");
  redirect("/admin/navigation");
}

export async function updateNavigationItem(
  id: string,
  _state: NavigationItemFormState,
  formData: FormData
): Promise<NavigationItemFormState> {
  await verifySession();
  const parsed = readNavigationItemFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("navigation_items").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update navigation item: ${error.message}` };
  }

  revalidatePath("/admin/navigation");
  redirect("/admin/navigation");
}

export async function deleteNavigationItem(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("navigation_items").delete().eq("id", id);
  revalidatePath("/admin/navigation");
}
