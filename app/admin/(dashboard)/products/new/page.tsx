import { listCollectionsForPicker } from "@/lib/cms/products";
import { listMedia } from "@/lib/cms/media";
import { createProduct } from "@/app/admin/products/actions";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default async function NewProductPage() {
  const [collections, media] = await Promise.all([
    listCollectionsForPicker(),
    listMedia(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        New product
      </h1>
      <ProductForm collections={collections} media={media} action={createProduct} />
    </div>
  );
}
