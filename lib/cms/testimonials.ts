import { createClient } from "@/lib/cms/supabase/server";

export type TestimonialAdminListItem = {
  id: string;
  authorName: string;
  status: "draft" | "published";
  position: number;
};

export async function listTestimonialsAdmin(): Promise<TestimonialAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, status, position")
    .order("position", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    authorName: row.author_name,
    status: row.status,
    position: row.position,
  }));
}

export type TestimonialAdminDetail = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  content: string;
  rating: number | null;
  avatarMediaId: string | null;
  status: "draft" | "published";
  position: number;
};

export async function getTestimonialAdmin(id: string): Promise<TestimonialAdminDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    authorName: data.author_name,
    authorTitle: data.author_title,
    content: data.content,
    rating: data.rating,
    avatarMediaId: data.avatar_media_id,
    status: data.status,
    position: data.position,
  };
}

// ---------------------------------------------------------------------
// Dashboard Statistics (Phase 12) — efficient count functions for admin overview
// ---------------------------------------------------------------------

export async function countTestimonials(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("testimonials")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
