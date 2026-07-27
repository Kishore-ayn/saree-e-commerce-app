import Link from "next/link";
import { listProductsAdmin } from "@/lib/cms/products";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await listProductsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No products yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">SKU</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {product.name}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{product.sku}</td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                  {product.price ?? "—"}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{product.status}</td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
