import { describe, expect, test } from "vitest";
import { mapBlogPostRow, type RawBlogPostRow } from "@/lib/cms/blog";
import type { createStaticClient } from "@/lib/cms/supabase/static";

const fakeSupabase = {
  storage: {
    from: (bucket: string) => ({
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://fake.supabase.co/storage/v1/object/public/${bucket}/${path}` },
      }),
    }),
  },
} as unknown as ReturnType<typeof createStaticClient>;

function makeRow(overrides: Partial<RawBlogPostRow> = {}): RawBlogPostRow {
  return {
    slug: "test-post",
    title: "Test Post",
    meta_description: "A test post.",
    excerpt: "An excerpt.",
    content: null,
    author_name: "Kishore Sarees Team",
    published_at: "2026-01-12T10:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    cover_media: null,
    blog_post_collections: [],
    ...overrides,
  };
}

describe("mapBlogPostRow", () => {
  test("splits markdown content on blank lines into the paragraph/heading block shape BlogContent.tsx expects", () => {
    const post = mapBlogPostRow(
      fakeSupabase,
      makeRow({
        content: "Intro paragraph.\n\n## Fabric Quality\n\nBody paragraph about fabric.",
      })
    );
    expect(post.content).toEqual([
      "Intro paragraph.",
      "## Fabric Quality",
      "Body paragraph about fabric.",
    ]);
  });

  test("returns an empty array for null content rather than crashing", () => {
    const post = mapBlogPostRow(fakeSupabase, makeRow({ content: null }));
    expect(post.content).toEqual([]);
  });

  test("uses published_at date portion, falling back to created_at when unpublished", () => {
    const published = mapBlogPostRow(fakeSupabase, makeRow({ published_at: "2026-03-05T12:00:00.000Z" }));
    expect(published.date).toBe("2026-03-05");

    const unpublished = mapBlogPostRow(
      fakeSupabase,
      makeRow({ published_at: null, created_at: "2026-01-15T00:00:00.000Z" })
    );
    expect(unpublished.date).toBe("2026-01-15");
  });

  test("resolves cover_media to a public URL, or empty string when unset", () => {
    const withCover = mapBlogPostRow(
      fakeSupabase,
      makeRow({ cover_media: { storage_path: "image/cover.jpg" } })
    );
    expect(withCover.coverImage).toBe(
      "https://fake.supabase.co/storage/v1/object/public/media/image/cover.jpg"
    );

    const withoutCover = mapBlogPostRow(fakeSupabase, makeRow({ cover_media: null }));
    expect(withoutCover.coverImage).toBe("");
  });

  test("maps related collection slugs, dropping null entries", () => {
    const post = mapBlogPostRow(
      fakeSupabase,
      makeRow({
        blog_post_collections: [{ collections: { slug: "bridal-sarees" } }, { collections: null }],
      })
    );
    expect(post.relatedCollections).toEqual(["bridal-sarees"]);
  });
});
