"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

const ALLOWED_MIME_TYPES: Record<string, "image" | "video" | "pdf"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "application/pdf": "pdf",
};

export type UploadMediaState = { error?: string } | undefined;

export async function uploadMedia(
  _state: UploadMediaState,
  formData: FormData
): Promise<UploadMediaState> {
  const user = await verifySession();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  const fileType = ALLOWED_MIME_TYPES[file.type];
  if (!fileType) {
    return { error: `Unsupported file type: ${file.type}` };
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const storagePath = `${fileType}/${crypto.randomUUID()}.${extension}`;

  const supabase = await createClient();

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase.from("media").insert({
    storage_path: storagePath,
    file_type: fileType,
    mime_type: file.type,
    size_bytes: file.size,
    uploaded_by: user.id,
  });

  if (insertError) {
    await supabase.storage.from("media").remove([storagePath]);
    return { error: `Could not save media record: ${insertError.message}` };
  }

  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string, storagePath: string) {
  await verifySession();
  const supabase = await createClient();

  await supabase.storage.from("media").remove([storagePath]);
  await supabase.from("media").delete().eq("id", id);

  revalidatePath("/admin/media");
}
