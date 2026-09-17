"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { DefaultSeo } from "@/lib/cms/settings";
import type { MediaItem } from "@/lib/cms/media";
import type { SeoSettingsFormState } from "@/app/admin/settings/actions";
import { updateSeoSettings } from "@/app/admin/settings/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function SeoSettingsForm({
  defaultSeo,
  media,
}: {
  defaultSeo: DefaultSeo;
  media: MediaItem[];
}) {
  const [state, formAction, pending] = useActionState<SeoSettingsFormState, FormData>(
    updateSeoSettings,
    undefined
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <label className={labelClass}>Default meta title</label>
        <input
          name="defaultMetaTitle"
          defaultValue={defaultSeo.defaultMetaTitle ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>
          Title template (use %s for the page title, e.g. &quot;%s | Smiley Collections&quot;)
        </label>
        <input
          name="titleTemplate"
          defaultValue={defaultSeo.titleTemplate ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Default meta description</label>
        <textarea
          name="defaultMetaDescription"
          rows={3}
          defaultValue={defaultSeo.defaultMetaDescription ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Twitter/X handle</label>
        <input
          name="twitterHandle"
          placeholder="@handle"
          defaultValue={defaultSeo.twitterHandle ?? ""}
          className={inputClass}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Default social share image (from Media Library)</legend>
        {media.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No media uploaded yet — upload some in the Media Library first.
          </p>
        )}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          <label className="flex aspect-square items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <input
              type="radio"
              name="defaultOgMediaId"
              value=""
              defaultChecked={!defaultSeo.defaultOgMediaId}
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
                    name="defaultOgMediaId"
                    value={m.id}
                    defaultChecked={defaultSeo.defaultOgMediaId === m.id}
                  />
                  select
                </span>
              </label>
            ))}
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save SEO settings"}
      </button>
    </form>
  );
}
