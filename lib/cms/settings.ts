import { createClient } from "@/lib/cms/supabase/server";

export type DefaultSeo = {
  defaultMetaTitle: string | null;
  titleTemplate: string | null;
  defaultMetaDescription: string | null;
  defaultOgMediaId: string | null;
  twitterHandle: string | null;
};

export type Address = {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
};

export type Geo = {
  lat: string | null;
  lng: string | null;
};

export type BusinessHourRow = {
  day: string;
  hours: string;
};

export type SocialLinks = {
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  youtube: string | null;
  pinterest: string | null;
};

export type Analytics = {
  googleAnalyticsId: string | null;
  metaPixelId: string | null;
  gtmId: string | null;
};

export type ThemeColors = {
  background: string | null;
  foreground: string | null;
  primary: string | null;
  primaryDark: string | null;
  primaryForeground: string | null;
  gold: string | null;
  goldLight: string | null;
  goldForeground: string | null;
};

export type SiteSettingsAdmin = {
  businessName: string | null;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: Address;
  geo: Geo;
  businessHours: BusinessHourRow[];
  socialLinks: SocialLinks;
  analytics: Analytics;
  theme: ThemeColors;
  defaultSeo: DefaultSeo;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const EMPTY_SEO: DefaultSeo = {
  defaultMetaTitle: null,
  titleTemplate: null,
  defaultMetaDescription: null,
  defaultOgMediaId: null,
  twitterHandle: null,
};

const EMPTY_ADDRESS: Address = {
  street: null,
  city: null,
  state: null,
  postalCode: null,
  country: null,
};

const EMPTY_GEO: Geo = { lat: null, lng: null };

const EMPTY_SOCIAL: SocialLinks = {
  instagram: null,
  facebook: null,
  whatsapp: null,
  youtube: null,
  pinterest: null,
};

const EMPTY_ANALYTICS: Analytics = {
  googleAnalyticsId: null,
  metaPixelId: null,
  gtmId: null,
};

const EMPTY_THEME: ThemeColors = {
  background: null,
  foreground: null,
  primary: null,
  primaryDark: null,
  primaryForeground: null,
  gold: null,
  goldLight: null,
  goldForeground: null,
};

function defaultBusinessHours(): BusinessHourRow[] {
  return DAYS.map((day) => ({ day, hours: "" }));
}

function mergeBusinessHours(stored: unknown): BusinessHourRow[] {
  if (!Array.isArray(stored) || stored.length === 0) return defaultBusinessHours();
  return DAYS.map((day) => {
    const found = (stored as BusinessHourRow[]).find((row) => row.day === day);
    return { day, hours: found?.hours ?? "" };
  });
}

export async function getSiteSettingsAdmin(): Promise<SiteSettingsAdmin> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  if (error || !data) {
    return {
      businessName: null,
      tagline: null,
      description: null,
      phone: null,
      whatsapp: null,
      email: null,
      address: EMPTY_ADDRESS,
      geo: EMPTY_GEO,
      businessHours: defaultBusinessHours(),
      socialLinks: EMPTY_SOCIAL,
      analytics: EMPTY_ANALYTICS,
      theme: EMPTY_THEME,
      defaultSeo: EMPTY_SEO,
    };
  }

  return {
    businessName: data.business_name,
    tagline: data.tagline,
    description: data.description,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    address: { ...EMPTY_ADDRESS, ...(data.address ?? {}) },
    geo: { ...EMPTY_GEO, ...(data.geo ?? {}) },
    businessHours: mergeBusinessHours(data.business_hours),
    socialLinks: { ...EMPTY_SOCIAL, ...(data.social_links ?? {}) },
    analytics: { ...EMPTY_ANALYTICS, ...(data.analytics ?? {}) },
    theme: { ...EMPTY_THEME, ...(data.theme ?? {}) },
    defaultSeo: { ...EMPTY_SEO, ...(data.default_seo ?? {}) },
  };
}
