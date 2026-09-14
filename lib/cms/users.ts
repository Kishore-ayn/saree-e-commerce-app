import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";
import { createAdminClient } from "@/lib/cms/supabase/admin";

/**
 * Every function in this file (and app/admin/users/actions.ts) that touches
 * the service-role client MUST call this first. RLS does not protect
 * auth.admin.* calls -- this check is the only gate.
 */
export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (profile.role !== "admin") {
    redirect("/admin/dashboard");
  }
  return profile;
}

export async function requireAdminOrEditor() {
  const profile = await getCurrentProfile();
  if (profile.role !== "admin" && profile.role !== "editor") {
    redirect("/admin/dashboard");
  }
  return profile;
}

export type UserAdminListItem = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: "admin" | "editor";
  lastSignInAt: string | null;
};

export async function listUsersAdmin(): Promise<UserAdminListItem[]> {
  await requireAdmin();

  const adminClient = createAdminClient();
  const { data: authData, error: authError } = await adminClient.auth.admin.listUsers();
  if (authError || !authData) return [];

  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id, full_name, role");
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return authData.users.map((user) => {
    const profile = profileById.get(user.id);
    return {
      id: user.id,
      email: user.email ?? null,
      fullName: profile?.full_name ?? null,
      role: (profile?.role as "admin" | "editor") ?? "editor",
      lastSignInAt: user.last_sign_in_at ?? null,
    };
  });
}

// ---------------------------------------------------------------------
// Dashboard Statistics (Phase 12) — efficient count functions for admin overview
// ---------------------------------------------------------------------

export async function countUsersByRole(role: "admin" | "editor"): Promise<number> {
  await requireAdmin(); // Only admins can view user counts

  const adminClient = createAdminClient();
  const { data: authData, error: authError } = await adminClient.auth.admin.listUsers();
  if (authError || !authData) return 0;

  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id, role");
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return authData.users.filter((user) => {
    const profile = profileById.get(user.id);
    return (profile?.role as "admin" | "editor") === role;
  }).length;
}
