"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { TestimonialAdminDetail } from "@/lib/cms/testimonials";
import type { MediaItem } from "@/lib/cms/media";
import type { TestimonialFormState } from "@/app/admin/testimonials/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function TestimonialForm({
  testimonial,
  media,
  action,
}: {
  testimonial?: TestimonialAdminDetail;
  media: MediaItem[];
  action: (state: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Author name</label>
          <input name="author_name" defaultValue={testimonial?.authorName} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Author title</label>
          <input name="author_title" defaultValue={testimonial?.authorTitle ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Testimonial</label>
        <textarea name="content" rows={4} defaultValue={testimonial?.content} required className={inputClass} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Rating</label>
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={testimonial?.rating ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={testimonial?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Position</label>
          <input name="position" type="number" defaultValue={testimonial?.position ?? 0} className={inputClass} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Avatar (from Media Library)</legend>
        {media.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No media uploaded yet — upload some in the Media Library first.
          </p>
        )}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          <label className="flex aspect-square items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <input
              type="radio"
              name="avatar_media_id"
              value=""
              defaultChecked={!testimonial?.avatarMediaId}
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
                    name="avatar_media_id"
                    value={m.id}
                    defaultChecked={testimonial?.avatarMediaId === m.id}
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
        {pending ? "Saving..." : "Save testimonial"}
      </button>
    </form>
  );
}
