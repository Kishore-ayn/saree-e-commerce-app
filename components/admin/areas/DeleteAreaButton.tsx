"use client";

import { useTransition } from "react";
import { deleteArea } from "@/app/admin/areas/actions";

export function DeleteAreaButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(() => deleteArea(id));
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
