import { createClient } from "@/lib/cms/supabase/server";

export type FaqAdminListItem = {
  id: string;
  question: string;
  status: "draft" | "published";
  position: number;
  areaName: string | null;
};

export async function listFaqsAdmin(): Promise<FaqAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, status, position, areas(name)")
    .order("position", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    question: row.question,
    status: row.status,
    position: row.position,
    areaName: (row.areas as unknown as { name: string } | null)?.name ?? null,
  }));
}

export type FaqAdminDetail = {
  id: string;
  areaId: string | null;
  question: string;
  content: string;
  status: "draft" | "published";
  position: number;
};

export async function getFaqAdmin(id: string): Promise<FaqAdminDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, area_id, question, content, status, position")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    areaId: data.area_id,
    question: data.question,
    content: data.content,
    status: data.status,
    position: data.position,
  };
}

// ---------------------------------------------------------------------
// Dashboard Statistics (Phase 12) — efficient count functions for admin overview
// ---------------------------------------------------------------------

export async function countFaqs(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("faqs")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
