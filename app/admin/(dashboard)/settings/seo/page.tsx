import { getSiteSettingsAdmin } from "@/lib/cms/settings";
import { listMedia } from "@/lib/cms/media";
import { SeoSettingsForm } from "@/components/admin/settings/SeoSettingsForm";

export default async function AdminSeoSettingsPage() {
  const [settings, media] = await Promise.all([getSiteSettingsAdmin(), listMedia()]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        SEO Settings
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        These are site-wide fallbacks, used when a page hasn&apos;t set its own meta title,
        description, or share image.
      </p>
      <SeoSettingsForm defaultSeo={settings.defaultSeo} media={media} />
    </div>
  );
}
