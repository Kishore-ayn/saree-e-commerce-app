"use client";

import { useActionState } from "react";
import type { SectionAdminDetail } from "@/lib/cms/pages";
import type { SectionFormState } from "@/app/admin/pages/sections-actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

const SECTION_TYPES = ["hero", "about", "faq", "testimonials", "gallery", "cta", "custom"] as const;

export function SectionForm({
  section,
  action,
}: {
  section?: SectionAdminDetail;
  action: (state: SectionFormState, formData: FormData) => Promise<SectionFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Section type</label>
          <select name="section_type" defaultValue={section?.sectionType ?? "custom"} className={inputClass}>
            {SECTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={section?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Position</label>
          <input name="position" type="number" defaultValue={section?.position ?? 0} className={inputClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>
          {`Data (JSON — shape depends on section type, e.g. {"heading": "...", "subtext": "...", "ctaLabel": "..."} for hero)`}
        </label>
        <textarea
          name="data"
          rows={10}
          spellCheck={false}
          defaultValue={JSON.stringify(section?.data ?? {}, null, 2)}
          className={`${inputClass} font-mono`}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save section"}
      </button>
    </form>
  );
}
