import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/cms/supabase/server";

export type AdminRole = "admin" | "editor";

export type CurrentProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: AdminRole;
};

/**
 * Verifies a session exists, redirecting to /admin/login otherwise.
 * Cached per request (React `cache()`) so calling it from multiple
 * components/actions during one render doesn't re-hit Supabase each time.
 */
export const verifySession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
});

/**
 * Loads the current user's profile (including role) under RLS. Use this
 * wherever a role check is needed rather than trusting client input.
 */
export const getCurrentProfile = cache(async (): Promise<CurrentProfile> => {
  const user = await verifySession();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/admin/login");
  }

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
    role: profile.role as AdminRole,
  };
});
