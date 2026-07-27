"use client";

import { useTransition } from "react";
import { deleteTestimonial } from "@/app/admin/testimonials/actions";

export function DeleteTestimonialButton({ id, authorName }: { id: string; authorName: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete testimonial from "${authorName}"? This cannot be undone.`)) return;
    startTransition(() => deleteTestimonial(id));
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
