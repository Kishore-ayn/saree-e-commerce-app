import Link from "next/link";
import { listPagesAdmin } from "@/lib/cms/pages";
import { DeletePageButton } from "@/components/admin/pages/DeletePageButton";

export default async function AdminPagesPage() {
  const pages = await listPagesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New page
        </Link>
      </div>

      {pages.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No pages yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Template</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {page.title}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{page.slug}</td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{page.template}</td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{page.status}</td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeletePageButton id={page.id} title={page.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
