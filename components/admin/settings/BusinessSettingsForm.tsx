"use client";

import { useActionState } from "react";
import type { SiteSettingsAdmin } from "@/lib/cms/settings";
import { updateBusinessSettings, type BusinessSettingsFormState } from "@/app/admin/settings/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function BusinessSettingsForm({
  settings,
}: {
  settings: Pick<
    SiteSettingsAdmin,
    "businessName" | "tagline" | "description" | "phone" | "whatsapp" | "email" | "address" | "geo" | "businessHours" | "socialLinks" | "analytics"
  >;
}) {
  const [state, formAction, pending] = useActionState<BusinessSettingsFormState, FormData>(
    updateBusinessSettings,
    undefined
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Business info
        </legend>
        <div className="space-y-1">
          <label className={labelClass}>Business name</label>
          <input name="business_name" defaultValue={settings.businessName ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Tagline</label>
          <input name="tagline" defaultValue={settings.tagline ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Description</label>
          <textarea name="description" rows={3} defaultValue={settings.description ?? ""} className={inputClass} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Phone</label>
            <input name="phone" defaultValue={settings.phone ?? ""} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>WhatsApp</label>
            <input name="whatsapp" defaultValue={settings.whatsapp ?? ""} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Email</label>
            <input name="email" type="email" defaultValue={settings.email ?? ""} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Address</legend>
        <div className="space-y-1">
          <label className={labelClass}>Street</label>
          <input name="address.street" defaultValue={settings.address.street ?? ""} className={inputClass} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <input name="address.city" placeholder="City" defaultValue={settings.address.city ?? ""} className={inputClass} />
          <input name="address.state" placeholder="State" defaultValue={settings.address.state ?? ""} className={inputClass} />
          <input
            name="address.postalCode"
            placeholder="Postal code"
            defaultValue={settings.address.postalCode ?? ""}
            className={inputClass}
          />
          <input name="address.country" placeholder="Country" defaultValue={settings.address.country ?? ""} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="geo.lat" placeholder="Latitude" defaultValue={settings.geo.lat ?? ""} className={inputClass} />
          <input name="geo.lng" placeholder="Longitude" defaultValue={settings.geo.lng ?? ""} className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Business hours
        </legend>
        {settings.businessHours.map((row) => (
          <div key={row.day} className="grid grid-cols-3 items-center gap-4">
            <label className={labelClass}>{row.day}</label>
            <input
              name={`hours.${row.day}`}
              placeholder="9:00 AM - 8:00 PM, or Closed"
              defaultValue={row.hours}
              className={`${inputClass} col-span-2`}
            />
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Social links
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <input name="social.instagram" placeholder="Instagram URL" defaultValue={settings.socialLinks.instagram ?? ""} className={inputClass} />
          <input name="social.facebook" placeholder="Facebook URL" defaultValue={settings.socialLinks.facebook ?? ""} className={inputClass} />
          <input name="social.whatsapp" placeholder="WhatsApp link" defaultValue={settings.socialLinks.whatsapp ?? ""} className={inputClass} />
          <input name="social.youtube" placeholder="YouTube URL" defaultValue={settings.socialLinks.youtube ?? ""} className={inputClass} />
          <input name="social.pinterest" placeholder="Pinterest URL" defaultValue={settings.socialLinks.pinterest ?? ""} className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Analytics
        </legend>
        <div className="grid grid-cols-3 gap-4">
          <input
            name="analytics.googleAnalyticsId"
            placeholder="Google Analytics ID"
            defaultValue={settings.analytics.googleAnalyticsId ?? ""}
            className={inputClass}
          />
          <input
            name="analytics.metaPixelId"
            placeholder="Meta Pixel ID"
            defaultValue={settings.analytics.metaPixelId ?? ""}
            className={inputClass}
          />
          <input
            name="analytics.gtmId"
            placeholder="GTM container ID"
            defaultValue={settings.analytics.gtmId ?? ""}
            className={inputClass}
          />
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save business settings"}
      </button>
    </form>
  );
}
