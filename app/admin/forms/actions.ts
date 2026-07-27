"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type FormDefinitionFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; error: string };

function readFormFields(formData: FormData): ReadFieldsResult {
  const name = formData.get("name");
  const slug = formData.get("slug");

  if (typeof name !== "string" || !name.trim()) return { ok: false, error: "Name is required." };
  if (typeof slug !== "string" || !slug.trim()) return { ok: false, error: "Slug is required." };

  const fieldsRaw = (formData.get("fields") as string) ?? "[]";
  let fields: unknown[] = [];
  try {
    const parsed = JSON.parse(fieldsRaw || "[]");
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Fields must be a JSON array, e.g. [{\"name\": \"email\", \"label\": \"Email\", \"type\": \"email\", \"required\": true}]." };
    }
    fields = parsed;
  } catch {
    return { ok: false, error: "Fields must be valid JSON." };
  }

  return {
    ok: true,
    fields: {
      name,
      slug,
      fields,
      notification_email: (formData.get("notification_email") as string) || null,
      is_active: formData.get("is_active") === "on",
    },
  };
}

export async function createForm(
  _state: FormDefinitionFormState,
  formData: FormData
): Promise<FormDefinitionFormState> {
  await verifySession();
  const parsed = readFormFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("forms").insert(parsed.fields);

  if (error) {
    return { error: `Could not create form: ${error.message}` };
  }

  revalidatePath("/admin/forms");
  redirect("/admin/forms");
}

export async function updateForm(
  id: string,
  _state: FormDefinitionFormState,
  formData: FormData
): Promise<FormDefinitionFormState> {
  await verifySession();
  const parsed = readFormFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("forms").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update form: ${error.message}` };
  }

  revalidatePath("/admin/forms");
  redirect("/admin/forms");
}

export async function deleteForm(id: string) {
  await verifySession();
  const supabase = await createClient();
  // Admin-only per RLS (forms delete policy) -- an editor calling this will
  // silently affect 0 rows rather than erroring; see Phase 10.1 plan note.
  await supabase.from("forms").delete().eq("id", id);
  revalidatePath("/admin/forms");
}
