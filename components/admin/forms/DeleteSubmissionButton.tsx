"use client";

import { useTransition } from "react";
import { deleteSubmission } from "@/app/admin/forms/submissions-actions";

export function DeleteSubmissionButton({ id, formId }: { id: string; formId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this submission? This cannot be undone. (Admin only.)")) return;
    startTransition(() => deleteSubmission(id, formId));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
