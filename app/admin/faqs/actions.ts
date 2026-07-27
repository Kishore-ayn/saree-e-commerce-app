"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type FaqFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; error: string };

function readFaqFields(formData: FormData): ReadFieldsResult {
  const question = formData.get("question");
  const content = formData.get("content");

  if (typeof question !== "string" || !question.trim()) {
    return { ok: false, error: "Question is required." };
  }
  if (typeof content !== "string" || !content.trim()) {
    return { ok: false, error: "Answer is required." };
  }

  const areaId = (formData.get("area_id") as string) || null;
  const position = formData.get("position");

  return {
    ok: true,
    fields: {
      question,
      content,
      area_id: areaId,
      status: (formData.get("status") as string) || "draft",
      position: position ? Number(position) : 0,
    },
  };
}

export async function createFaq(
  _state: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  await verifySession();
  const parsed = readFaqFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert(parsed.fields);

  if (error) {
    return { error: `Could not create FAQ: ${error.message}` };
  }

  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function updateFaq(
  id: string,
  _state: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  await verifySession();
  const parsed = readFaqFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update FAQ: ${error.message}` };
  }

  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", id);
  revalidatePath("/admin/faqs");
}
