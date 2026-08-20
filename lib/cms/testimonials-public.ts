import { createStaticClient } from "@/lib/cms/supabase/static";

export type Testimonial = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  content: string;
  rating: number | null;
  avatarMediaId: string | null;
};

type RawTestimonialRow = {
  id: string;
  author_name: string;
  author_title: string | null;
  content: string;
  rating: number | null;
  avatar_media_id: string | null;
  status: string;
  position: number;
};

function mapTestimonialRow(
  _supabase: ReturnType<typeof createStaticClient>,
  row: RawTestimonialRow
): Testimonial {
  return {
    id: row.id,
    authorName: row.author_name,
    authorTitle: row.author_title,
    content: row.content,
    rating: row.rating,
    avatarMediaId: row.avatar_media_id,
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_title, content, rating, avatar_media_id"
    )
    .eq("status", "published")
    .order("position", { ascending: true });

  if (error || !data) return [];

  return (data as unknown as RawTestimonialRow[]).map((row) =>
    mapTestimonialRow(supabase, row)
  );
}