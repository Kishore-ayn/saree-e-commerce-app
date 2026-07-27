"use client";

import { useActionState } from "react";
import Image from "next/image";
import type {
  CollectionAdminDetail,
  AreaPickerItem,
  CollectionPickerItem,
} from "@/lib/cms/collections";
import type { MediaItem } from "@/lib/cms/media";
import type { CollectionFormState } from "@/app/admin/collections/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function CollectionForm({
  collection,
  areas,
  relatedCollections,
  media,
  action,
}: {
  collection?: CollectionAdminDetail;
  areas: AreaPickerItem[];
  relatedCollections: CollectionPickerItem[];
  media: MediaItem[];
  action: (state: CollectionFormState, formData: FormData) => Promise<CollectionFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Name</label>
          <input name="name" defaultValue={collection?.name} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={collection?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Page title</label>
        <input name="title" defaultValue={collection?.title} required className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Meta description</label>
        <input
          name="meta_description"
          defaultValue={collection?.metaDescription ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>H1</label>
        <input name="h1" defaultValue={collection?.h1 ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Intro</label>
        <textarea name="intro" rows={3} defaultValue={collection?.intro ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>SEO heading</label>
        <input name="seo_heading" defaultValue={collection?.seoHeading ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>SEO content (one paragraph per line)</label>
        <textarea
          name="seo_content"
          rows={6}
          defaultValue={(collection?.seoContent ?? []).join("\n")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={collection?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Position</label>
          <input
            name="position"
            type="number"
            defaultValue={collection?.position ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Related area link</legend>
        <div className="grid grid-cols-2 gap-4">
          <select
            name="related_area_id"
            defaultValue={collection?.relatedAreaId ?? ""}
            className={inputClass}
          >
            <option value="">(none)</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          <input
            name="related_area_label"
            placeholder="Display label, e.g. Kanchipuram Sarees in Gajuwaka"
            defaultValue={collection?.relatedAreaLabel ?? ""}
            className={inputClass}
          />
        </div>
        {areas.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No areas yet — create some in the Areas admin first.
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Related collections</legend>
        {relatedCollections.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No other collections yet.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {relatedCollections.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                name="related_collections"
                value={c.id}
                defaultChecked={collection?.relatedCollectionIds.includes(c.id)}
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
              name="image_media_id"
              value=""
              defaultChecked={!collection?.imageMediaId}
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
                    name="image_media_id"
                    value={m.id}
                    defaultChecked={collection?.imageMediaId === m.id}
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
        {pending ? "Saving..." : "Save collection"}
      </button>
    </form>
  );
}
