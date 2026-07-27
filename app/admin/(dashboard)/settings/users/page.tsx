import { listUsersAdmin } from "@/lib/cms/users";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { InviteUserForm } from "@/components/admin/users/InviteUserForm";

export default async function AdminUsersPage() {
  const users = await listUsersAdmin();

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Users &amp; Roles
      </h1>
      <InviteUserForm />
      <UsersTable users={users} />
    </div>
  );
}
