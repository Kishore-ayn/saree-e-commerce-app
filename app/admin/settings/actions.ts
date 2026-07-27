"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type SeoSettingsFormState = { error?: string; success?: boolean } | undefined;

export async function updateSeoSettings(
  _state: SeoSettingsFormState,
  formData: FormData
): Promise<SeoSettingsFormState> {
  const user = await verifySession();

  const defaultSeo = {
    defaultMetaTitle: (formData.get("defaultMetaTitle") as string) || null,
    titleTemplate: (formData.get("titleTemplate") as string) || null,
    defaultMetaDescription: (formData.get("defaultMetaDescription") as string) || null,
    defaultOgMediaId: (formData.get("defaultOgMediaId") as string) || null,
    twitterHandle: (formData.get("twitterHandle") as string) || null,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ default_seo: defaultSeo, updated_by: user.id })
    .eq("id", 1);

  if (error) {
    return { error: `Could not save SEO settings: ${error.message}` };
  }

  revalidatePath("/admin/settings/seo");
  return { success: true };
}

export type BusinessSettingsFormState = { error?: string; success?: boolean } | undefined;

export async function updateBusinessSettings(
  _state: BusinessSettingsFormState,
  formData: FormData
): Promise<BusinessSettingsFormState> {
  const user = await verifySession();

  const address = {
    street: (formData.get("address.street") as string) || null,
    city: (formData.get("address.city") as string) || null,
    state: (formData.get("address.state") as string) || null,
    postalCode: (formData.get("address.postalCode") as string) || null,
    country: (formData.get("address.country") as string) || null,
  };

  const geo = {
    lat: (formData.get("geo.lat") as string) || null,
    lng: (formData.get("geo.lng") as string) || null,
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const businessHours = days.map((day) => ({
    day,
    hours: (formData.get(`hours.${day}`) as string) || "",
  }));

  const socialLinks = {
    instagram: (formData.get("social.instagram") as string) || null,
    facebook: (formData.get("social.facebook") as string) || null,
    whatsapp: (formData.get("social.whatsapp") as string) || null,
    youtube: (formData.get("social.youtube") as string) || null,
    pinterest: (formData.get("social.pinterest") as string) || null,
  };

  const analytics = {
    googleAnalyticsId: (formData.get("analytics.googleAnalyticsId") as string) || null,
    metaPixelId: (formData.get("analytics.metaPixelId") as string) || null,
    gtmId: (formData.get("analytics.gtmId") as string) || null,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      business_name: (formData.get("business_name") as string) || null,
      tagline: (formData.get("tagline") as string) || null,
      description: (formData.get("description") as string) || null,
      phone: (formData.get("phone") as string) || null,
      whatsapp: (formData.get("whatsapp") as string) || null,
      email: (formData.get("email") as string) || null,
      address,
      geo,
      business_hours: businessHours,
      social_links: socialLinks,
      analytics,
      updated_by: user.id,
    })
    .eq("id", 1);

  if (error) {
    return { error: `Could not save business settings: ${error.message}` };
  }

  revalidatePath("/admin/settings/business");
  return { success: true };
}

export type ThemeSettingsFormState = { error?: string; success?: boolean } | undefined;

export async function updateThemeSettings(
  _state: ThemeSettingsFormState,
  formData: FormData
): Promise<ThemeSettingsFormState> {
  const user = await verifySession();

  const theme = {
    background: (formData.get("background") as string) || null,
    foreground: (formData.get("foreground") as string) || null,
    primary: (formData.get("primary") as string) || null,
    primaryDark: (formData.get("primaryDark") as string) || null,
    primaryForeground: (formData.get("primaryForeground") as string) || null,
    gold: (formData.get("gold") as string) || null,
    goldLight: (formData.get("goldLight") as string) || null,
    goldForeground: (formData.get("goldForeground") as string) || null,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ theme, updated_by: user.id })
    .eq("id", 1);

  if (error) {
    return { error: `Could not save theme settings: ${error.message}` };
  }

  revalidatePath("/admin/settings/theme");
  return { success: true };
}
