"use client";

import { useTransition } from "react";
import { deletePage } from "@/app/admin/pages/actions";

export function DeletePageButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${title}" and all its sections? This cannot be undone.`)) return;
    startTransition(() => deletePage(id));
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
