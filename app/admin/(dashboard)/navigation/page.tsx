import Link from "next/link";
import { listNavigationItemsAdmin } from "@/lib/cms/navigation";
import { DeleteNavigationItemButton } from "@/components/admin/navigation/DeleteNavigationItemButton";

export default async function AdminNavigationPage() {
  const items = await listNavigationItemsAdmin();
  const header = items.filter((i) => i.location === "header");
  const footer = items.filter((i) => i.location === "footer");

  function renderGroup(groupItems: typeof items, title: string) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        {groupItems.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No items yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <tr>
                <th className="py-2 pr-4">Label</th>
                <th className="py-2 pr-4">Link</th>
                <th className="py-2 pr-4">Visible</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {groupItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                    {item.parentId ? <span className="text-neutral-400">&mdash; </span> : null}
                    {item.label}
                  </td>
                  <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{item.href}</td>
                  <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                    {item.isVisible ? "Yes" : "No"}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/navigation/${item.id}/edit`}
                      className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                    >
                      Edit
                    </Link>
                    <DeleteNavigationItemButton id={item.id} label={item.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Navigation</h1>
        <Link
          href="/admin/navigation/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New item
        </Link>
      </div>

      {renderGroup(header, "Header")}
      {renderGroup(footer, "Footer")}
    </div>
  );
}
