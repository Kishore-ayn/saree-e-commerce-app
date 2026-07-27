"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/users";
import { createClient } from "@/lib/cms/supabase/server";
import { createAdminClient } from "@/lib/cms/supabase/admin";

export async function updateUserRole(userId: string, role: "admin" | "editor") {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);

  revalidatePath("/admin/settings/users");
}

export type InviteUserFormState = { error?: string; success?: boolean } | undefined;

export async function inviteUser(
  _state: InviteUserFormState,
  formData: FormData
): Promise<InviteUserFormState> {
  await requireAdmin();

  const email = formData.get("email");
  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.inviteUserByEmail(email);

  if (error) {
    return { error: `Could not invite user: ${error.message}` };
  }

  revalidatePath("/admin/settings/users");
  return { success: true };
}
