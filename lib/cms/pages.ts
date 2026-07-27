import { createClient } from "@/lib/cms/supabase/server";

export type PageAdminListItem = {
  id: string;
  slug: string;
  title: string;
  template: "home" | "standard" | "landing";
  status: "draft" | "published";
};

export async function listPagesAdmin(): Promise<PageAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, slug, title, template, status")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export type PageSectionAdmin = {
  id: string;
  sectionType: "hero" | "about" | "faq" | "testimonials" | "gallery" | "cta" | "custom";
  position: number;
  data: Record<string, unknown>;
  status: "draft" | "published";
};

export type PageAdminDetail = {
  id: string;
  slug: string;
  title: string;
  template: "home" | "standard" | "landing";
  metaTitle: string | null;
  metaDescription: string | null;
  ogMediaId: string | null;
  status: "draft" | "published";
  sections: PageSectionAdmin[];
};

export async function getPageAdmin(id: string): Promise<PageAdminDetail | null> {
  const supabase = await createClient();

  const { data: page, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !page) return null;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("id, section_type, position, data, status")
    .eq("page_id", id)
    .order("position", { ascending: true });

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    template: page.template,
    metaTitle: page.meta_title,
    metaDescription: page.meta_description,
    ogMediaId: page.og_media_id,
    status: page.status,
    sections: (sections ?? []).map((s) => ({
      id: s.id,
      sectionType: s.section_type,
      position: s.position,
      data: s.data ?? {},
      status: s.status,
    })),
  };
}

export type SectionAdminDetail = {
  id: string;
  pageId: string;
  sectionType: "hero" | "about" | "faq" | "testimonials" | "gallery" | "cta" | "custom";
  position: number;
  data: Record<string, unknown>;
  status: "draft" | "published";
};

export async function getSectionAdmin(id: string): Promise<SectionAdminDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    pageId: data.page_id,
    sectionType: data.section_type,
    position: data.position,
    data: data.data ?? {},
    status: data.status,
  };
}
