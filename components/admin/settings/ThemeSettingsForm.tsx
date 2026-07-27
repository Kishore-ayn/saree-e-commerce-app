"use client";

import { useActionState } from "react";
import type { ThemeColors } from "@/lib/cms/settings";
import { updateThemeSettings, type ThemeSettingsFormState } from "@/app/admin/settings/actions";

const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

const FIELDS: { key: keyof ThemeColors; label: string; fallback: string }[] = [
  { key: "background", label: "Background", fallback: "#fbf7f0" },
  { key: "foreground", label: "Foreground (text)", fallback: "#2a1a1a" },
  { key: "primary", label: "Primary", fallback: "#7a1f35" },
  { key: "primaryDark", label: "Primary (dark)", fallback: "#5c1728" },
  { key: "primaryForeground", label: "Primary foreground", fallback: "#ffffff" },
  { key: "gold", label: "Gold", fallback: "#b08d3e" },
  { key: "goldLight", label: "Gold (light)", fallback: "#d4b876" },
  { key: "goldForeground", label: "Gold foreground", fallback: "#2a1a1a" },
];

export function ThemeSettingsForm({ theme }: { theme: ThemeColors }) {
  const [state, formAction, pending] = useActionState<ThemeSettingsFormState, FormData>(
    updateThemeSettings,
    undefined
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        These map to the brand color tokens in the site&apos;s stylesheet. Applying them to the
        live site is part of Website Integration (a later phase) — this saves the values now.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, fallback }) => (
          <div key={key} className="space-y-1">
            <label className={labelClass}>{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name={key}
                defaultValue={theme[key] ?? fallback}
                className="h-9 w-12 rounded border border-neutral-300 dark:border-neutral-700"
              />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {theme[key] ?? fallback}
              </span>
            </div>
          </div>
        ))}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save theme"}
      </button>
    </form>
  );
}
