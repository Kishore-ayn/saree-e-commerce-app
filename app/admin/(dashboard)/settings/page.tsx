import Link from "next/link";

const SETTINGS_SECTIONS = [
  { label: "SEO", href: "/admin/settings/seo", available: true },
  { label: "Business info", href: "/admin/settings/business", available: true },
  { label: "Theme", href: "/admin/settings/theme", available: true },
  { label: "Users", href: "/admin/settings/users", available: true },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Settings</h1>
      <div className="max-w-md divide-y divide-neutral-100 rounded-lg border border-neutral-200 dark:divide-neutral-900 dark:border-neutral-800">
        {SETTINGS_SECTIONS.map((section) =>
          section.available ? (
            <Link
              key={section.href}
              href={section.href}
              className="block px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {section.label}
            </Link>
          ) : (
            <span
              key={section.href}
              className="flex items-center justify-between px-4 py-3 text-sm text-neutral-400 dark:text-neutral-600"
            >
              {section.label}
              <span className="text-xs">Coming soon</span>
            </span>
          )
        )}
      </div>
    </div>
  );
}
