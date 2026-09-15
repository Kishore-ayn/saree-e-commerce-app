import { createClient } from "@/lib/cms/supabase/server";

export type NavigationItemAdminListItem = {
  id: string;
  label: string;
  href: string;
  location: "header" | "footer";
  parentId: string | null;
  position: number;
  isVisible: boolean;
};

export async function listNavigationItemsAdmin(): Promise<NavigationItemAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("navigation_items")
    .select("id, label, href, location, parent_id, position, is_visible")
    .order("location", { ascending: true })
    .order("position", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    label: row.label,
    href: row.href,
    location: row.location,
    parentId: row.parent_id,
    position: row.position,
    isVisible: row.is_visible,
  }));
}

export type NavigationItemAdminDetail = {
  id: string;
  label: string;
  href: string;
  location: "header" | "footer";
  parentId: string | null;
  position: number;
  openInNewTab: boolean;
  isVisible: boolean;
};

export async function getNavigationItemAdmin(id: string): Promise<NavigationItemAdminDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    label: data.label,
    href: data.href,
    location: data.location,
    parentId: data.parent_id,
    position: data.position,
    openInNewTab: data.open_in_new_tab,
    isVisible: data.is_visible,
  };
}

export type NavigationItemPickerItem = { id: string; label: string };

export async function listNavigationItemsForPicker(
  location: "header" | "footer",
  excludeId?: string
): Promise<NavigationItemPickerItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("navigation_items")
    .select("id, label")
    .eq("location", location)
    .order("label", { ascending: true });

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

// ---------------------------------------------------------------------
// Dashboard Statistics (Phase 12) — efficient count functions for admin overview
// ---------------------------------------------------------------------

export async function countNavigationItems(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("navigation_items")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
