"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";

export type TestimonialFormState = { error?: string } | undefined;

type ReadFieldsResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; error: string };

function readTestimonialFields(formData: FormData): ReadFieldsResult {
  const authorName = formData.get("author_name");
  const content = formData.get("content");

  if (typeof authorName !== "string" || !authorName.trim()) {
    return { ok: false, error: "Author name is required." };
  }
  if (typeof content !== "string" || !content.trim()) {
    return { ok: false, error: "Testimonial content is required." };
  }

  const rating = formData.get("rating");
  const position = formData.get("position");
  const avatarMediaId = (formData.get("avatar_media_id") as string) || null;

  return {
    ok: true,
    fields: {
      author_name: authorName,
      author_title: (formData.get("author_title") as string) || null,
      content,
      rating: rating ? Number(rating) : null,
      avatar_media_id: avatarMediaId,
      status: (formData.get("status") as string) || "draft",
      position: position ? Number(position) : 0,
    },
  };
}

export async function createTestimonial(
  _state: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await verifySession();
  const parsed = readTestimonialFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(parsed.fields);

  if (error) {
    return { error: `Could not create testimonial: ${error.message}` };
  }

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  _state: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await verifySession();
  const parsed = readTestimonialFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update testimonial: ${error.message}` };
  }

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
}
