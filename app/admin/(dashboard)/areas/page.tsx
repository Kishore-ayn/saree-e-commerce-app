import Link from "next/link";
import { listAreasAdmin } from "@/lib/cms/areas";
import { DeleteAreaButton } from "@/components/admin/areas/DeleteAreaButton";

export default async function AdminAreasPage() {
  const areas = await listAreasAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Areas</h1>
        <Link
          href="/admin/areas/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New area
        </Link>
      </div>

      {areas.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No areas yet.</p>
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
            {areas.map((area) => (
              <tr key={area.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {area.name}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{area.slug}</td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{area.status}</td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/areas/${area.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteAreaButton id={area.id} name={area.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
