import { getSiteSettingsAdmin } from "@/lib/cms/settings";
import { BusinessSettingsForm } from "@/components/admin/settings/BusinessSettingsForm";

export default async function AdminBusinessSettingsPage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Business Settings
      </h1>
      <BusinessSettingsForm settings={settings} />
    </div>
  );
}
