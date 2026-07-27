"use client";

import { useActionState } from "react";
import { inviteUser } from "@/app/admin/users/actions";

export function InviteUserForm() {
  const [state, formAction, pending] = useActionState(inviteUser, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Invite by email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="teammate@example.com"
          className="w-64 rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Sending..." : "Send invite"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="w-full text-sm text-green-600">Invite sent.</p>}
    </form>
  );
}
