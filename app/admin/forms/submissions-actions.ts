"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export async function updateSubmissionStatus(
  id: string,
  formId: string,
  status: "new" | "read" | "archived" | "spam"
) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("form_submissions").update({ status }).eq("id", id);
  revalidatePath(`/admin/forms/${formId}/submissions`);
}

export async function deleteSubmission(id: string, formId: string) {
  await verifySession();
  const supabase = await createClient();
  // Admin-only per RLS (form_submissions delete policy) -- see Phase 10.1 plan note.
  await supabase.from("form_submissions").delete().eq("id", id);
  revalidatePath(`/admin/forms/${formId}/submissions`);
}
