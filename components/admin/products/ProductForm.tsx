"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { ProductAdminDetail, CollectionPickerItem } from "@/lib/cms/products";
import type { MediaItem } from "@/lib/cms/media";
import type { ProductFormState } from "@/app/admin/products/actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function ProductForm({
  product,
  collections,
  media,
  action,
}: {
  product?: ProductAdminDetail;
  collections: CollectionPickerItem[];
  media: MediaItem[];
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Name</label>
          <input name="name" defaultValue={product?.name} required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={product?.slug} required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>SKU</label>
          <input name="sku" defaultValue={product?.sku ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Price</label>
          <input name="price" type="number" step="0.01" defaultValue={product?.price ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Compare-at price</label>
          <input
            name="compare_at_price"
            type="number"
            step="0.01"
            defaultValue={product?.compareAtPrice ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Short description</label>
        <textarea name="description" rows={2} defaultValue={product?.description ?? ""} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Long description</label>
        <textarea
          name="long_description"
          rows={4}
          defaultValue={product?.longDescription ?? ""}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>
          Attributes (JSON — business-specific fields, e.g. fabric, colors, occasions)
        </label>
        <textarea
          name="attributes"
          rows={6}
          spellCheck={false}
          defaultValue={JSON.stringify(product?.attributes ?? {}, null, 2)}
          className={`${inputClass} font-mono`}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Rating</label>
          <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.ratingValue ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Review count</label>
          <input name="review_count" type="number" min="0" defaultValue={product?.reviewCount ?? 0} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={product?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" name="in_stock" defaultChecked={product?.inStock ?? true} /> In stock
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" name="is_new_arrival" defaultChecked={product?.isNewArrival} /> New arrival
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" name="is_bestseller" defaultChecked={product?.isBestseller} /> Bestseller
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Meta title</label>
          <input name="meta_title" defaultValue={product?.metaTitle ?? ""} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Meta description</label>
          <input name="meta_description" defaultValue={product?.metaDescription ?? ""} className={inputClass} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Collections</legend>
        {collections.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No collections yet — create some first.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {collections.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                name="collections"
                value={c.id}
                defaultChecked={product?.collectionIds.includes(c.id)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Images (from Media Library)</legend>
        {media.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No media uploaded yet — upload some in the Media Library first.
          </p>
        )}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {media
            .filter((m) => m.fileType === "image")
            .map((m) => (
              <label key={m.id} className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="relative block aspect-square w-full overflow-hidden rounded-md">
                  <Image src={m.url} alt="" fill sizes="100px" className="object-cover" />
                </span>
                <span className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="media"
                    value={m.id}
                    defaultChecked={product?.mediaIds.includes(m.id)}
                  />
                  select
                </span>
              </label>
            ))}
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}
