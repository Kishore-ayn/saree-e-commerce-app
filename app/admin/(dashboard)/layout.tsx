import { getCurrentProfile } from "@/lib/cms/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
