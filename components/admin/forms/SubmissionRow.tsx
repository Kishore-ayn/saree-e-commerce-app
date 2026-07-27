"use client";

import { useTransition } from "react";
import { updateSubmissionStatus } from "@/app/admin/forms/submissions-actions";
import { DeleteSubmissionButton } from "@/components/admin/forms/DeleteSubmissionButton";
import type { FormSubmissionAdmin } from "@/lib/cms/forms";

const STATUSES = ["new", "read", "archived", "spam"] as const;

export function SubmissionRow({ submission, formId }: { submission: FormSubmissionAdmin; formId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: (typeof STATUSES)[number]) {
    startTransition(() => updateSubmissionStatus(submission.id, formId, status));
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {new Date(submission.createdAt).toLocaleString()}
          {submission.submittedIp ? ` · ${submission.submittedIp}` : ""}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={submission.status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as (typeof STATUSES)[number])}
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <DeleteSubmissionButton id={submission.id} formId={formId} />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {Object.entries(submission.data).map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="font-medium text-neutral-700 dark:text-neutral-300">{key}</dt>
            <dd className="text-neutral-600 dark:text-neutral-400">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
