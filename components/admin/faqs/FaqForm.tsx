"use client";

import { useActionState } from "react";
import type { FaqAdminDetail } from "@/lib/cms/faqs";
import type { AreaPickerItem } from "@/lib/cms/collections";
import type { FaqFormState } from "@/app/admin/faqs/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function FaqForm({
  faq,
  areas,
  action,
}: {
  faq?: FaqAdminDetail;
  areas: AreaPickerItem[];
  action: (state: FaqFormState, formData: FormData) => Promise<FaqFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <label className={labelClass}>Question</label>
        <input name="question" defaultValue={faq?.question} required className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Answer</label>
        <textarea name="content" rows={5} defaultValue={faq?.content} required className={inputClass} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-1">
          <label className={labelClass}>Scope</label>
          <select name="area_id" defaultValue={faq?.areaId ?? ""} className={inputClass}>
            <option value="">Global (site-wide)</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={faq?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Position</label>
          <input name="position" type="number" defaultValue={faq?.position ?? 0} className={inputClass} />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save FAQ"}
      </button>
    </form>
  );
}
