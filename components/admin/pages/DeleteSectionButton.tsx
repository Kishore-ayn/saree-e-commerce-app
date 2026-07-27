"use client";

import { useTransition } from "react";
import { deleteSection } from "@/app/admin/pages/sections-actions";

export function DeleteSectionButton({ id, pageId }: { id: string; pageId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this section? This cannot be undone.")) return;
    startTransition(() => deleteSection(id, pageId));
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
