import { createClient } from "@/lib/cms/supabase/server";
import { createStaticClient } from "@/lib/cms/supabase/static";
import type { BlogPost } from "@/lib/types";

export type BlogPostAdminListItem = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  publishedAt: string | null;
};

export async function listBlogPostsAdmin(): Promise<BlogPostAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, status, published_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    publishedAt: row.published_at,
  }));
}

export type BlogPostAdminDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  authorName: string | null;
  coverMediaId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  collectionIds: string[];
};

export async function getBlogPostAdmin(id: string): Promise<BlogPostAdminDetail | null> {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) return null;

  const { data: collectionLinks } = await supabase
    .from("blog_post_collections")
    .select("collection_id")
    .eq("blog_post_id", id);

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    authorName: post.author_name,
    coverMediaId: post.cover_media_id,
    metaTitle: post.meta_title,
    metaDescription: post.meta_description,
    status: post.status,
    publishedAt: post.published_at,
    collectionIds: (collectionLinks ?? []).map((row) => row.collection_id),
  };
}

// ---------------------------------------------------------------------
// Public-facing (Phase 11) — return shapes match lib/types.ts BlogPost
// exactly. Published rows only.
//
// Note: content is stored as markdown text (a deliberate Phase 3 change
// from the old string[]-of-blocks convention). components/blog/BlogContent.tsx
// already renders string[] as paragraph/##/### blocks, so splitting on
// blank lines here reproduces that shape with no component changes needed.
// ---------------------------------------------------------------------

export type RawBlogPostRow = {
  slug: string;
  title: string;
  meta_description: string | null;
  excerpt: string | null;
  content: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  cover_media: { storage_path: string } | null;
  blog_post_collections: { collections: { slug: string } | null }[] | null;
};

export function mapBlogPostRow(
  supabase: ReturnType<typeof createStaticClient>,
  row: RawBlogPostRow
): BlogPost {
  const relatedCollections = (row.blog_post_collections ?? [])
    .map((bc) => bc.collections?.slug)
    .filter((slug): slug is string => Boolean(slug));

  const coverImage = row.cover_media
    ? supabase.storage.from("media").getPublicUrl(row.cover_media.storage_path).data.publicUrl
    : "";

  return {
    slug: row.slug,
    title: row.title,
    metaDescription: row.meta_description ?? "",
    excerpt: row.excerpt ?? "",
    date: (row.published_at ?? row.created_at).slice(0, 10),
    author: row.author_name ?? "",
    coverImage,
    content: (row.content ?? "").split(/\n\s*\n/).filter(Boolean),
    relatedCollections: relatedCollections.length > 0 ? relatedCollections : undefined,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "*, cover_media:cover_media_id(storage_path), blog_post_collections(collections(slug))"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as RawBlogPostRow[]).map((row) => mapBlogPostRow(supabase, row));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "*, cover_media:cover_media_id(storage_path), blog_post_collections(collections(slug))"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;

  return mapBlogPostRow(supabase, data as unknown as RawBlogPostRow);
}
