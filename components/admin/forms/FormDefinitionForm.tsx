"use client";

import { useActionState } from "react";
import type { FormAdminDetail } from "@/lib/cms/forms";
import type { FormDefinitionFormState } from "@/app/admin/forms/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function FormDefinitionForm({
  form,
  action,
}: {
  form?: FormAdminDetail;
  action: (state: FormDefinitionFormState, formData: FormData) => Promise<FormDefinitionFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Name</label>
          <input name="name" defaultValue={form?.name} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={form?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Notification email</label>
        <input
          name="notification_email"
          type="email"
          defaultValue={form?.notificationEmail ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input type="checkbox" name="is_active" defaultChecked={form?.isActive ?? true} /> Active
        (accepts submissions)
      </label>

      <div className="space-y-1">
        <label className={labelClass}>
          {`Fields (JSON array, e.g. [{"name": "email", "label": "Email", "type": "email", "required": true}])`}
        </label>
        <textarea
          name="fields"
          rows={10}
          spellCheck={false}
          defaultValue={JSON.stringify(form?.fields ?? [], null, 2)}
          className={`${inputClass} font-mono`}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save form"}
      </button>
    </form>
  );
}
