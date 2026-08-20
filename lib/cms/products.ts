import { createClient } from "@/lib/cms/supabase/server";
import { createStaticClient } from "@/lib/cms/supabase/static";
import type { Product } from "@/lib/types";

export type ProductAdminListItem = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  price: number | null;
  status: "draft" | "published";
};

export async function listProductsAdmin(): Promise<ProductAdminListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, sku, price, status")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export type ProductAdminDetail = {
  id: string;
  slug: string;
  kind: "product" | "service";
  sku: string | null;
  name: string;
  description: string | null;
  longDescription: string | null;
  price: number | null;
  compareAtPrice: number | null;
  attributes: Record<string, unknown>;
  ratingValue: number | null;
  reviewCount: number;
  inStock: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "draft" | "published";
  collectionIds: string[];
  mediaIds: string[];
};

export async function getProductAdmin(
  id: string
): Promise<ProductAdminDetail | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) return null;

  const [{ data: collectionLinks }, { data: mediaLinks }] = await Promise.all([
    supabase.from("product_collections").select("collection_id").eq("product_id", id),
    supabase
      .from("product_media")
      .select("media_id")
      .eq("product_id", id)
      .order("position", { ascending: true }),
  ]);

  return {
    id: product.id,
    slug: product.slug,
    kind: product.kind,
    sku: product.sku,
    name: product.name,
    description: product.description,
    longDescription: product.long_description,
    price: product.price,
    compareAtPrice: product.compare_at_price,
    attributes: product.attributes ?? {},
    ratingValue: product.rating,
    reviewCount: product.review_count,
    inStock: product.in_stock,
    isNewArrival: product.is_new_arrival,
    isBestseller: product.is_bestseller,
    metaTitle: product.meta_title,
    metaDescription: product.meta_description,
    status: product.status,
    collectionIds: (collectionLinks ?? []).map((row) => row.collection_id),
    mediaIds: (mediaLinks ?? []).map((row) => row.media_id),
  };
}

export type CollectionPickerItem = { id: string; name: string };

export async function listCollectionsForPicker(): Promise<CollectionPickerItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, name")
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data;
}

// ---------------------------------------------------------------------
// Public-facing (Phase 11) — return shapes match lib/types.ts Product
// exactly, so pages can swap `import { products } from "@/data/products"`
// for these with no other changes. Published rows only.
// ---------------------------------------------------------------------

export type RawProductRow = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  description: string | null;
  long_description: string | null;
  price: number | null;
  compare_at_price: number | null;
  attributes: Record<string, unknown> | null;
  rating: number | null;
  review_count: number;
  in_stock: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  product_collections: { collections: { slug: string } | null }[] | null;
  product_media: { position: number; media: { storage_path: string } | null }[] | null;
};

export function mapProductRow(
  supabase: ReturnType<typeof createStaticClient>,
  row: RawProductRow
): Product {
  const attributes = row.attributes ?? {};

  const images = (row.product_media ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((pm) => pm.media?.storage_path)
    .filter((path): path is string => Boolean(path))
    .map((path) => supabase.storage.from("media").getPublicUrl(path).data.publicUrl);

  const collectionSlugs = (row.product_collections ?? [])
    .map((pc) => pc.collections?.slug)
    .filter((slug): slug is string => Boolean(slug));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    // Falls back to "Cotton" for incomplete data entry rather than crashing
    // the page — attributes is free-form jsonb, not DB-validated.
    fabric: (attributes.fabric as Product["fabric"]) ?? "Cotton",
    collections: collectionSlugs,
    occasions: (attributes.occasions as Product["occasions"]) ?? [],
    colors: (attributes.colors as Product["colors"]) ?? [],
    price: row.price ?? 0,
    mrp: row.compare_at_price ?? row.price ?? 0,
    description: row.description ?? "",
    longDescription: row.long_description ?? "",
    images,
    rating: row.rating ?? 0,
    reviewCount: row.review_count,
    inStock: row.in_stock,
    isNewArrival: row.is_new_arrival,
    isBestseller: row.is_bestseller,
    sku: row.sku ?? "",
    blousePiece: Boolean(attributes.blousePiece),
    length: (attributes.length as string) ?? "",
    care: (attributes.care as string) ?? "",
    areas: (attributes.areas as string[] | undefined) ?? undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_collections(collections(slug)), product_media(position, media(storage_path))"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as RawProductRow[]).map((row) => mapProductRow(supabase, row));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_collections(collections(slug)), product_media(position, media(storage_path))"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;

  return mapProductRow(supabase, data as unknown as RawProductRow);
}

export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_collections(collections(slug)), product_media(position, media(storage_path))"
    )
    .eq("status", "published")
    .eq("product_collections.collection.slug", collectionSlug)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as RawProductRow[]).map((row) => mapProductRow(supabase, row));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createStaticClient();

  // Build OR conditions for fabric match OR collection match
  const collectionConditions = product.collections
    .map((c) => `product_collections.collection.slug.eq.${c}`)
    .join(',');

  let query = supabase
    .from("products")
    .select(
      "*, product_collections(collections(slug)), product_media(position, media(storage_path))"
    )
    .eq("status", "published")
    .neq("id", product.id)
    .order("created_at", { ascending: false });

  // Add OR condition for fabric or collections
  if (product.fabric && collectionConditions) {
    query = query.or(`fabric.eq.${product.fabric},${collectionConditions}`);
  } else if (product.fabric) {
    query = query.eq("fabric", product.fabric);
  } else if (collectionConditions) {
    query = query.or(collectionConditions);
  }

  // Limit the results
  query = query.limit(limit);

  const { data, error } = await query;

  if (error || !data) return [];
  return (data as unknown as RawProductRow[]).map((row) => mapProductRow(supabase, row));
}
