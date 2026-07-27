import { notFound } from "next/navigation";
import { getProductAdmin, listCollectionsForPicker } from "@/lib/cms/products";
import { listMedia } from "@/lib/cms/media";
import { updateProduct } from "@/app/admin/products/actions";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, collections, media] = await Promise.all([
    getProductAdmin(id),
    listCollectionsForPicker(),
    listMedia(),
  ]);

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit product
      </h1>
      <ProductForm
        product={product}
        collections={collections}
        media={media}
        action={updateProductWithId}
      />
    </div>
  );
}
