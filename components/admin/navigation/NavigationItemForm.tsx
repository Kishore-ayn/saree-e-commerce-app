"use client";

import { useActionState } from "react";
import type { NavigationItemAdminDetail } from "@/lib/cms/navigation";
import type { NavigationItemFormState } from "@/app/admin/navigation/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

type OtherItem = { id: string; label: string; location: "header" | "footer" };

export function NavigationItemForm({
  item,
  otherItems,
  action,
}: {
  item?: NavigationItemAdminDetail;
  otherItems: OtherItem[];
  action: (state: NavigationItemFormState, formData: FormData) => Promise<NavigationItemFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Label</label>
          <input name="label" defaultValue={item?.label} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Link (href)</label>
          <input name="href" defaultValue={item?.href} required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Location</label>
          <select name="location" defaultValue={item?.location ?? "header"} className={inputClass}>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Parent (for nested menus)</label>
          <select name="parent_id" defaultValue={item?.parentId ?? ""} className={inputClass}>
            <option value="">(none — top level)</option>
            {otherItems.map((other) => (
              <option key={other.id} value={other.id}>
                {other.label} ({other.location})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Position</label>
          <input name="position" type="number" defaultValue={item?.position ?? 0} className={inputClass} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" name="open_in_new_tab" defaultChecked={item?.openInNewTab} /> Open in
          new tab
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" name="is_visible" defaultChecked={item?.isVisible ?? true} /> Visible
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save navigation item"}
      </button>
    </form>
  );
}
