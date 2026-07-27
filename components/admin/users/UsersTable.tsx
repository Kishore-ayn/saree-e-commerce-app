"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/app/admin/users/actions";
import type { UserAdminListItem } from "@/lib/cms/users";

export function UsersTable({ users }: { users: UserAdminListItem[] }) {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(userId: string, role: "admin" | "editor") {
    startTransition(() => updateUserRole(userId, role));
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <tr>
          <th className="py-2 pr-4">Email</th>
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Last sign-in</th>
          <th className="py-2 pr-4">Role</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
              {user.email}
            </td>
            <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
              {user.fullName ?? "—"}
            </td>
            <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
              {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Never"}
            </td>
            <td className="py-2 pr-4">
              <select
                value={user.role}
                disabled={isPending}
                onChange={(e) => handleRoleChange(user.id, e.target.value as "admin" | "editor")}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
