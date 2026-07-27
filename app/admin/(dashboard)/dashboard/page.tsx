import { getCurrentProfile } from "@/lib/cms/auth";

export default async function AdminDashboardPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Welcome{profile.fullName ? `, ${profile.fullName}` : ""}
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Content management widgets (products, collections, recent activity)
        are added in later phases.
      </p>
    </div>
  );
}
