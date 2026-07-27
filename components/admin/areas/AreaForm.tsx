"use client";

import { useActionState } from "react";
import type { AreaAdminDetail } from "@/lib/cms/areas";
import type { CollectionPickerItem } from "@/lib/cms/products";
import type { AreaFormState } from "@/app/admin/areas/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function AreaForm({
  area,
  collections,
  action,
}: {
  area?: AreaAdminDetail;
  collections: CollectionPickerItem[];
  action: (state: AreaFormState, formData: FormData) => Promise<AreaFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Name</label>
          <input name="name" defaultValue={area?.name} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={area?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Page title</label>
        <input name="title" defaultValue={area?.title} required className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Meta description</label>
        <input name="meta_description" defaultValue={area?.metaDescription ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>H1</label>
        <input name="h1" defaultValue={area?.h1 ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Intro</label>
        <textarea name="intro" rows={4} defaultValue={area?.intro ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Landmarks (one per line)</label>
        <textarea
          name="landmarks"
          rows={4}
          defaultValue={(area?.landmarks ?? []).join("\n")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={area?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Position</label>
          <input name="position" type="number" defaultValue={area?.position ?? 0} className={inputClass} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Relevant collections</legend>
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
                defaultChecked={area?.collectionIds.includes(c.id)}
              />
              {c.name}
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
        {pending ? "Saving..." : "Save area"}
      </button>
    </form>
  );
}
