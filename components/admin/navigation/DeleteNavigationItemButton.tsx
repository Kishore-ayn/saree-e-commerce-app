"use client";

import { useTransition } from "react";
import { deleteNavigationItem } from "@/app/admin/navigation/actions";

export function DeleteNavigationItemButton({ id, label }: { id: string; label: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${label}"? Child items will also be deleted. This cannot be undone.`)) return;
    startTransition(() => deleteNavigationItem(id));
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
