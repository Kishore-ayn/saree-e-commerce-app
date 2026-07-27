"use client";

import { useTransition } from "react";
import { deleteBlogPost } from "@/app/admin/blog/actions";

export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(() => deleteBlogPost(id));
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
