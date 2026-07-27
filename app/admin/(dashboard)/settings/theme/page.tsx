import { getSiteSettingsAdmin } from "@/lib/cms/settings";
import { ThemeSettingsForm } from "@/components/admin/settings/ThemeSettingsForm";

export default async function AdminThemeSettingsPage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Theme Settings
      </h1>
      <ThemeSettingsForm theme={settings.theme} />
    </div>
  );
}
