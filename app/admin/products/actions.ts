"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { createClient } from "@/lib/cms/supabase/server";
import { revalidatePublicSite } from "@/lib/cms/revalidate-public";

export type ProductFormState = { error?: string } | undefined;

type AttributesResult =
  | { ok: true; attributes: Record<string, unknown> }
  | { ok: false; error: string };

function parseAttributes(raw: FormDataEntryValue | null): AttributesResult {
  if (typeof raw !== "string" || !raw.trim()) return { ok: true, attributes: {} };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ok: false, error: "Attributes must be a JSON object, e.g. {\"fabric\": \"Cotton\"}." };
    }
    return { ok: true, attributes: parsed };
  } catch {
    return { ok: false, error: "Attributes must be valid JSON." };
  }
}

type ReadFieldsResult =
  | {
      ok: true;
      fields: Record<string, unknown>;
      collectionIds: string[];
      mediaIds: string[];
    }
  | { ok: false; error: string };

function readProductFields(formData: FormData): ReadFieldsResult {
  const name = formData.get("name");
  const slug = formData.get("slug");

  if (typeof name !== "string" || !name.trim()) return { ok: false, error: "Name is required." };
  if (typeof slug !== "string" || !slug.trim()) return { ok: false, error: "Slug is required." };

  const attributesResult = parseAttributes(formData.get("attributes"));
  if (!attributesResult.ok) return attributesResult;

  const price = formData.get("price");
  const compareAtPrice = formData.get("compare_at_price");
  const rating = formData.get("rating");

  return {
    ok: true,
    fields: {
      name,
      slug,
      sku: (formData.get("sku") as string) || null,
      description: (formData.get("description") as string) || null,
      long_description: (formData.get("long_description") as string) || null,
      price: price ? Number(price) : null,
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      attributes: attributesResult.attributes,
      rating: rating ? Number(rating) : null,
      review_count: Number(formData.get("review_count") || 0),
      in_stock: formData.get("in_stock") === "on",
      is_new_arrival: formData.get("is_new_arrival") === "on",
      is_bestseller: formData.get("is_bestseller") === "on",
      meta_title: (formData.get("meta_title") as string) || null,
      meta_description: (formData.get("meta_description") as string) || null,
      status: (formData.get("status") as string) || "draft",
    },
    collectionIds: formData.getAll("collections") as string[],
    mediaIds: formData.getAll("media") as string[],
  };
}

async function syncProductJoins(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  collectionIds: string[],
  mediaIds: string[]
) {
  await supabase.from("product_collections").delete().eq("product_id", productId);
  if (collectionIds.length > 0) {
    await supabase.from("product_collections").insert(
      collectionIds.map((collection_id) => ({ product_id: productId, collection_id }))
    );
  }

  await supabase.from("product_media").delete().eq("product_id", productId);
  if (mediaIds.length > 0) {
    await supabase.from("product_media").insert(
      mediaIds.map((media_id, position) => ({ product_id: productId, media_id, position }))
    );
  }
}

export async function createProduct(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifySession();
  const parsed = readProductFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(parsed.fields)
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Could not create product: ${error?.message}` };
  }

  await syncProductJoins(supabase, data.id, parsed.collectionIds, parsed.mediaIds);

  revalidatePath("/admin/products");
  revalidatePublicSite();
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifySession();
  const parsed = readProductFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(parsed.fields).eq("id", id);

  if (error) {
    return { error: `Could not update product: ${error.message}` };
  }

  await syncProductJoins(supabase, id, parsed.collectionIds, parsed.mediaIds);

  revalidatePath("/admin/products");
  revalidatePublicSite();
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await verifySession();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePublicSite();
}
