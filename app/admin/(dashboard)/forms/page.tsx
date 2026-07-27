import Link from "next/link";
import { listFormsAdmin } from "@/lib/cms/forms";
import { DeleteFormButton } from "@/components/admin/forms/DeleteFormButton";

export default async function AdminFormsPage() {
  const forms = await listFormsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Forms</h1>
        <Link
          href="/admin/forms/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New form
        </Link>
      </div>

      {forms.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No forms yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Active</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {forms.map((form) => (
              <tr key={form.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {form.name}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{form.slug}</td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                  {form.isActive ? "Yes" : "No"}
                </td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/forms/${form.id}/submissions`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Submissions
                  </Link>
                  <Link
                    href={`/admin/forms/${form.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteFormButton id={form.id} name={form.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
