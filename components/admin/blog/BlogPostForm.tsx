"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { BlogPostAdminDetail } from "@/lib/cms/blog";
import type { CollectionPickerItem } from "@/lib/cms/products";
import type { MediaItem } from "@/lib/cms/media";
import type { BlogPostFormState } from "@/app/admin/blog/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function BlogPostForm({
  post,
  collections,
  media,
  action,
}: {
  post?: BlogPostAdminDetail;
  collections: CollectionPickerItem[];
  media: MediaItem[];
  action: (state: BlogPostFormState, formData: FormData) => Promise<BlogPostFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const publishedAtDate = post?.publishedAt ? post.publishedAt.slice(0, 10) : "";

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Title</label>
          <input name="title" defaultValue={post?.title} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={post?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Excerpt</label>
        <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Content (Markdown)</label>
        <textarea
          name="content"
          rows={12}
          spellCheck={false}
          defaultValue={post?.content ?? ""}
          className={`${inputClass} font-mono`}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Author</label>
          <input name="author_name" defaultValue={post?.authorName ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Published date</label>
          <input name="published_at" type="date" defaultValue={publishedAtDate} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={post?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Meta title</label>
          <input name="meta_title" defaultValue={post?.metaTitle ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Meta description</label>
          <input name="meta_description" defaultValue={post?.metaDescription ?? ""} className={inputClass} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Collections</legend>
        {collections.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No collections yet.</p>
        )}
        <div className="flex flex-wrap gap-3">
          {collections.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                name="collections"
                value={c.id}
                defaultChecked={post?.collectionIds.includes(c.id)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Cover image (from Media Library)</legend>
        {media.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No media uploaded yet — upload some in the Media Library first.
          </p>
        )}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          <label className="flex aspect-square items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <input
              type="radio"
              name="cover_media_id"
              value=""
              defaultChecked={!post?.coverMediaId}
              className="mr-1"
            />
            None
          </label>
          {media
            .filter((m) => m.fileType === "image")
            .map((m) => (
              <label key={m.id} className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="relative block aspect-square w-full overflow-hidden rounded-md">
                  <Image src={m.url} alt="" fill sizes="100px" className="object-cover" />
                </span>
                <span className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="cover_media_id"
                    value={m.id}
                    defaultChecked={post?.coverMediaId === m.id}
                  />
                  select
                </span>
              </label>
            ))}
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save post"}
      </button>
    </form>
  );
}
