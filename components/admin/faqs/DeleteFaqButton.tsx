"use client";

import { useTransition } from "react";
import { deleteFaq } from "@/app/admin/faqs/actions";

export function DeleteFaqButton({ id, question }: { id: string; question: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${question}"? This cannot be undone.`)) return;
    startTransition(() => deleteFaq(id));
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
