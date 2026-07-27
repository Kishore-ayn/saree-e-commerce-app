import Link from "next/link";
import { listCollectionsAdmin } from "@/lib/cms/collections";
import { DeleteCollectionButton } from "@/components/admin/collections/DeleteCollectionButton";

export default async function AdminCollectionsPage() {
  const collections = await listCollectionsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Collections
        </h1>
        <Link
          href="/admin/collections/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No collections yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {collection.name}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{collection.slug}</td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{collection.status}</td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/collections/${collection.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteCollectionButton id={collection.id} name={collection.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
