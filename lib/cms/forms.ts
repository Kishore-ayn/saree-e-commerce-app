import { createClient } from "@/lib/cms/supabase/server";

export type FormAdminListItem = {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
};

export async function listFormsAdmin(): Promise<FormAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("id, slug, name, is_active")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    isActive: row.is_active,
  }));
}

export type FormAdminDetail = {
  id: string;
  slug: string;
  name: string;
  fields: unknown[];
  notificationEmail: string | null;
  isActive: boolean;
};

export async function getFormAdmin(id: string): Promise<FormAdminDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("forms").select("*").eq("id", id).single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    fields: data.fields ?? [],
    notificationEmail: data.notification_email,
    isActive: data.is_active,
  };
}

export type FormSubmissionAdmin = {
  id: string;
  data: Record<string, unknown>;
  submittedIp: string | null;
  status: "new" | "read" | "archived" | "spam";
  createdAt: string;
};

export async function listSubmissionsForForm(formId: string): Promise<FormSubmissionAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("id, data, submitted_ip, status, created_at")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    data: row.data ?? {},
    submittedIp: row.submitted_ip,
    status: row.status,
    createdAt: row.created_at,
  }));
}
