"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { PageAdminDetail } from "@/lib/cms/pages";
import type { MediaItem } from "@/lib/cms/media";
import type { PageFormState } from "@/app/admin/pages/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function PageForm({
  page,
  media,
  action,
}: {
  page?: PageAdminDetail;
  media: MediaItem[];
  action: (state: PageFormState, formData: FormData) => Promise<PageFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Title</label>
          <input name="title" defaultValue={page?.title} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={page?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Template</label>
          <select name="template" defaultValue={page?.template ?? "standard"} className={inputClass}>
            <option value="home">Home</option>
            <option value="standard">Standard</option>
            <option value="landing">Landing</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={page?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Meta title</label>
          <input name="meta_title" defaultValue={page?.metaTitle ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Meta description</label>
          <input name="meta_description" defaultValue={page?.metaDescription ?? ""} className={inputClass} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Social share image (from Media Library)</legend>
        {media.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No media uploaded yet — upload some in the Media Library first.
          </p>
        )}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          <label className="flex aspect-square items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <input
              type="radio"
              name="og_media_id"
              value=""
              defaultChecked={!page?.ogMediaId}
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
                    name="og_media_id"
                    value={m.id}
                    defaultChecked={page?.ogMediaId === m.id}
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
        {pending ? "Saving..." : "Save page"}
      </button>
    </form>
  );
}
