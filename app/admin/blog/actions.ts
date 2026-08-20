"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";
import { revalidatePublicSite } from "@/lib/cms/revalidate-public";

export type BlogPostFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown>; collectionIds: string[] }
  | { ok: false; error: string };

function readBlogPostFields(formData: FormData): ReadFieldsResult {
  const title = formData.get("title");
  const slug = formData.get("slug");

  if (typeof title !== "string" || !title.trim()) return { ok: false, error: "Title is required." };
  if (typeof slug !== "string" || !slug.trim()) return { ok: false, error: "Slug is required." };

  const publishedAt = formData.get("published_at");
  const coverMediaId = (formData.get("cover_media_id") as string) || null;

  return {
    ok: true,
    fields: {
      title,
      slug,
      excerpt: (formData.get("excerpt") as string) || null,
      content: (formData.get("content") as string) || null,
      author_name: (formData.get("author_name") as string) || null,
      cover_media_id: coverMediaId,
      meta_title: (formData.get("meta_title") as string) || null,
      meta_description: (formData.get("meta_description") as string) || null,
      status: (formData.get("status") as string) || "draft",
      published_at: publishedAt ? new Date(publishedAt as string).toISOString() : null,
    },
    collectionIds: formData.getAll("collections") as string[],
  };
}

async function syncBlogPostCollections(
  supabase: Awaited<ReturnType<typeof createClient>>,
  blogPostId: string,
  collectionIds: string[]
) {
  await supabase.from("blog_post_collections").delete().eq("blog_post_id", blogPostId);
  if (collectionIds.length > 0) {
    await supabase.from("blog_post_collections").insert(
      collectionIds.map((collection_id) => ({ blog_post_id: blogPostId, collection_id }))
    );
  }
}

export async function createBlogPost(
  _state: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  await verifySession();
  const parsed = readBlogPostFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(parsed.fields)
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Could not create post: ${error?.message}` };
  }

  await syncBlogPostCollections(supabase, data.id, parsed.collectionIds);

  revalidatePath("/admin/blog");
  revalidatePublicSite();
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  _state: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  await verifySession();
  const parsed = readBlogPostFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update post: ${error.message}` };
  }

  await syncBlogPostCollections(supabase, id, parsed.collectionIds);

  revalidatePath("/admin/blog");
  revalidatePublicSite();
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePublicSite();
}
