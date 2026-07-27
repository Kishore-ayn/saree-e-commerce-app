"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadMedia } from "@/app/admin/media/actions";

export function MediaUploadForm() {
  const [state, action, pending] = useActionState(uploadMedia, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700"
    >
      <input
        type="file"
        name="file"
        required
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,application/pdf"
        className="text-sm text-neutral-700 dark:text-neutral-300"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Uploading..." : "Upload"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
