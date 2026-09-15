import { createClient } from "@/lib/cms/supabase/server";

export type MediaItem = {
  id: string;
  storagePath: string;
  url: string;
  fileType: "image" | "video" | "pdf";
  mimeType: string;
  sizeBytes: number;
  altText: string | null;
  caption: string | null;
  createdAt: string;
};

export async function listMedia(): Promise<MediaItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("id, storage_path, file_type, mime_type, size_bytes, alt_text, caption, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    storagePath: row.storage_path,
    url: supabase.storage.from("media").getPublicUrl(row.storage_path).data.publicUrl,
    fileType: row.file_type,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    altText: row.alt_text,
    caption: row.caption,
    createdAt: row.created_at,
  }));
}

// ---------------------------------------------------------------------
// Dashboard Statistics (Phase 12) — efficient count functions for admin overview
// ---------------------------------------------------------------------

export async function countMedia(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("media")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
